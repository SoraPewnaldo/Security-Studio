// ============================================================
// HTTP Client Tool Component
// ============================================================
import { useState, useCallback } from 'react';
import { Send, Plus, Trash2, Copy, ExternalLink, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { httpClientManifest } from './manifest';

const API_BASE = 'http://127.0.0.1:4000';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
type ActiveTab = 'request' | 'response' | 'headers' | 'cookies';

interface Header {
  key: string;
  value: string;
}

interface HttpResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  duration: number;
}

interface DetectedContent {
  type: 'jwt' | 'json' | 'xml' | 'pem' | 'cookie';
  label: string;
  toolId: string;
  value: string;
}

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: 'text-[#22C55E]',
  POST: 'text-[#2F81F7]',
  PUT: 'text-[#EAB308]',
  DELETE: 'text-[#EF4444]',
  PATCH: 'text-[#A855F7]',
  HEAD: 'text-[#71717A]',
  OPTIONS: 'text-[#71717A]',
};

function detectContent(response: HttpResponse): DetectedContent[] {
  const detected: DetectedContent[] = [];
  const body = response.body.trim();

  // JWT in body
  const jwtMatch = body.match(/eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/);
  if (jwtMatch) {
    detected.push({ type: 'jwt', label: 'JWT detected in body', toolId: 'jwt-inspector', value: jwtMatch[0] });
  }

  // Cookies in response headers
  const setCookie = response.headers['set-cookie'];
  if (setCookie) {
    detected.push({ type: 'cookie', label: 'Set-Cookie header found', toolId: 'session-cookie', value: setCookie });
  }

  // JSON body
  try {
    JSON.parse(body);
    if (!jwtMatch) {
      detected.push({ type: 'json', label: 'JSON response body', toolId: 'json-formatter', value: body });
    }
  } catch {}

  // XML body
  if (body.startsWith('<?xml') || body.startsWith('<')) {
    detected.push({ type: 'xml', label: 'XML response body', toolId: 'xml-formatter', value: body });
  }

  // PEM certificate
  if (body.includes('BEGIN CERTIFICATE')) {
    detected.push({ type: 'pem', label: 'PEM certificate found', toolId: 'cert-viewer', value: body });
  }

  return detected;
}

function StatusBadge({ status }: { status: number }) {
  const isOk = status >= 200 && status < 300;
  const isRedirect = status >= 300 && status < 400;
  const isError = status >= 400;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[13px] font-mono font-medium px-2 py-0.5 rounded ${
      isOk ? 'text-success bg-success/10' : isRedirect ? 'text-warning bg-warning/10' : 'text-danger bg-danger/10'
    }`}>
      {isOk ? <CheckCircle size={12} /> : isError ? <XCircle size={12} /> : <AlertTriangle size={12} />}
      {status}
    </span>
  );
}

export default function HttpClientTool() {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [headers, setHeaders] = useState<Header[]>([{ key: '', value: '' }]);
  const [body, setBody] = useState('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('request');
  const [response, setResponse] = useState<HttpResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const addHeader = () => setHeaders((h) => [...h, { key: '', value: '' }]);
  const removeHeader = (i: number) => setHeaders((h) => h.filter((_, idx) => idx !== i));
  const updateHeader = (i: number, field: 'key' | 'value', value: string) => {
    setHeaders((h) => h.map((hdr, idx) => idx === i ? { ...hdr, [field]: value } : hdr));
  };

  const sendRequest = useCallback(async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError('');
    setResponse(null);
    setActiveTab('response');

    try {
      const headersObj: Record<string, string> = {};
      headers.filter(h => h.key.trim()).forEach(h => { headersObj[h.key.trim()] = h.value.trim(); });

      const res = await fetch(`${API_BASE}/api/networking/http-proxy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), method, headers: headersObj, body: body || undefined }),
      });

      const data = await res.json();
      if (data.success) {
        setResponse(data.data);
      } else {
        setError(data.error || 'Request failed');
      }
    } catch (e: any) {
      setError(e.message || 'Connection failed');
    } finally {
      setLoading(false);
    }
  }, [url, method, headers, body]);

  const loadExample = (example: typeof httpClientManifest.examples[0]) => {
    setUrl(example.input.url);
    setMethod(example.input.method as HttpMethod);
    setBody(example.input.body || '');
    setHeaders(example.input.headers?.length ? example.input.headers : [{ key: '', value: '' }]);
  };

  const copyResponse = () => {
    if (!response) return;
    navigator.clipboard.writeText(response.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const openInTool = (detected: DetectedContent) => {
    sessionStorage.setItem(`tool_prefill_${detected.toolId}`, detected.value);
    navigate({ to: `/tools/${detected.toolId}` as any });
  };

  const detected = response ? detectContent(response) : [];

  const responseCookies = response ? Object.entries(response.headers).filter(([k]) =>
    k.toLowerCase().includes('cookie')
  ) : [];

  const responseHeaders = response ? Object.entries(response.headers) : [];

  const TABS: { id: ActiveTab; label: string }[] = [
    { id: 'request', label: 'Request' },
    { id: 'response', label: 'Response' },
    { id: 'headers', label: `Headers${response ? ` (${responseHeaders.length})` : ''}` },
    { id: 'cookies', label: `Cookies${responseCookies.length ? ` (${responseCookies.length})` : ''}` },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-border">
        <h1 className="text-[17px] font-semibold text-text">HTTP Client</h1>
        <p className="text-[13px] text-text-secondary mt-0.5">Make HTTP requests and pipe responses directly to Security Studio tools.</p>
        {/* Examples */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {httpClientManifest.examples.map((ex) => (
            <button key={ex.label} onClick={() => loadExample(ex)}
              className="text-[11px] px-2.5 py-1 rounded-md border border-border text-text-secondary hover:text-text hover:border-primary/50 transition-colors">
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* URL Bar */}
      <div className="flex-shrink-0 px-6 py-3 border-b border-border bg-surface">
        <div className="flex gap-2">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as HttpMethod)}
            className={`w-28 px-3 py-2 rounded-lg bg-bg border border-border text-[13px] font-mono font-semibold focus:outline-none focus:border-primary ${METHOD_COLORS[method]}`}
          >
            {(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'] as HttpMethod[]).map(m => (
              <option key={m} value={m} className="text-text">{m}</option>
            ))}
          </select>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendRequest()}
            placeholder="https://api.example.com/endpoint"
            className="flex-1 px-3 py-2 rounded-lg bg-bg border border-border text-[13px] font-mono text-text placeholder-text-muted focus:outline-none focus:border-primary"
          />
          <button
            onClick={sendRequest}
            disabled={loading || !url.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white text-[13px] font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            <Send size={14} />
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>

      {/* Tabs + Content */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-shrink-0 flex gap-0 border-b border-border px-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab.id
                  ? 'border-primary text-text'
                  : 'border-transparent text-text-secondary hover:text-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
          {response && (
            <div className="ml-auto flex items-center gap-3 py-2">
              <StatusBadge status={response.status} />
              <span className="text-[12px] text-text-muted flex items-center gap-1">
                <Clock size={11} />{response.duration}ms
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-auto min-h-0 px-6 py-4">
          {/* REQUEST TAB */}
          {activeTab === 'request' && (
            <div className="space-y-4">
              {/* Headers Editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[12px] font-medium text-text-secondary uppercase tracking-wider">Request Headers</label>
                  <button onClick={addHeader} className="flex items-center gap-1 text-[12px] text-primary hover:text-primary/80">
                    <Plus size={12} /> Add Header
                  </button>
                </div>
                <div className="space-y-1.5">
                  {headers.map((hdr, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={hdr.key} onChange={e => updateHeader(i, 'key', e.target.value)}
                        placeholder="Header name" className="w-48 px-2.5 py-1.5 rounded-lg bg-surface border border-border text-[13px] font-mono text-text focus:outline-none focus:border-primary" />
                      <input value={hdr.value} onChange={e => updateHeader(i, 'value', e.target.value)}
                        placeholder="Header value" className="flex-1 px-2.5 py-1.5 rounded-lg bg-surface border border-border text-[13px] font-mono text-text focus:outline-none focus:border-primary" />
                      <button onClick={() => removeHeader(i)} className="p-1.5 text-text-muted hover:text-danger transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              {/* Body */}
              {['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && (
                <div>
                  <label className="block text-[12px] font-medium text-text-secondary uppercase tracking-wider mb-2">Request Body</label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={10}
                    placeholder='{"key": "value"}'
                    className="w-full px-3 py-2.5 rounded-lg bg-surface border border-border text-[13px] font-mono text-text focus:outline-none focus:border-primary resize-y"
                  />
                </div>
              )}
            </div>
          )}

          {/* RESPONSE TAB */}
          {activeTab === 'response' && (
            <div className="space-y-4">
              {error && (
                <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-[13px]">
                  <XCircle size={15} className="mt-0.5 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Suggested Actions */}
              {detected.length > 0 && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <p className="text-[12px] font-medium text-primary uppercase tracking-wider mb-2.5">Suggested Actions</p>
                  <div className="flex flex-wrap gap-2">
                    {detected.map((d) => (
                      <button
                        key={d.type}
                        onClick={() => openInTool(d)}
                        className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-md bg-surface border border-border text-text hover:border-primary hover:text-primary transition-colors"
                      >
                        <ExternalLink size={11} />
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Body */}
              {response && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[12px] font-medium text-text-secondary uppercase tracking-wider">Response Body</label>
                    <button onClick={copyResponse} className="flex items-center gap-1 text-[12px] text-text-secondary hover:text-text">
                      <Copy size={12} /> {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <pre className="w-full p-4 rounded-lg bg-surface border border-border text-[12px] font-mono text-text overflow-auto max-h-[500px] whitespace-pre-wrap break-all">
                    {(() => { try { return JSON.stringify(JSON.parse(response.body), null, 2); } catch { return response.body; } })()}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* HEADERS TAB */}
          {activeTab === 'headers' && (
            <div>
              {responseHeaders.length === 0 ? (
                <p className="text-[13px] text-text-muted text-center py-12">Send a request to see response headers.</p>
              ) : (
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-3 text-text-secondary font-medium w-64">Header</th>
                      <th className="text-left py-2 px-3 text-text-secondary font-medium">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {responseHeaders.map(([k, v]) => (
                      <tr key={k} className="border-b border-border/50 hover:bg-surface/50">
                        <td className="py-2 px-3 font-mono text-primary">{k}</td>
                        <td className="py-2 px-3 font-mono text-text break-all">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* COOKIES TAB */}
          {activeTab === 'cookies' && (
            <div>
              {responseCookies.length === 0 ? (
                <p className="text-[13px] text-text-muted text-center py-12">No cookies in response.</p>
              ) : (
                <div className="space-y-2">
                  {responseCookies.map(([k, v]) => (
                    <div key={k} className="rounded-lg border border-border p-3 bg-surface">
                      <p className="text-[12px] font-medium text-primary mb-1">{k}</p>
                      <pre className="text-[12px] font-mono text-text whitespace-pre-wrap break-all">{v}</pre>
                      <button
                        onClick={() => { sessionStorage.setItem('tool_prefill_session-cookie', v); navigate({ to: '/tools/session-cookie' as any }); }}
                        className="mt-2 flex items-center gap-1 text-[11px] text-text-secondary hover:text-primary transition-colors"
                      >
                        <ExternalLink size={11} /> Analyze in Cookie Analyzer
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
