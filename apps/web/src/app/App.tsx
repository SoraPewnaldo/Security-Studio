import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  RouterProvider,
  createRouter,
  createRootRoute,
  createRoute,
  createHashHistory,
} from '@tanstack/react-router';
import { Toaster } from 'react-hot-toast';
import { RootLayout } from '@/layouts/RootLayout';
import { toolRegistry } from '@security-studio/tool-sdk';
import { ToolLayout } from '@/components/ToolLayout';
import { WorkspaceProvider } from '@/contexts/WorkspaceContext';
import { Suspense } from 'react';

// Lazy-loaded pages
import { Dashboard } from '@/features/dashboard/Dashboard';
import { AllTools } from '@/features/all-tools/AllTools';
import { FavoritesPage } from '@/features/favorites/FavoritesPage';
import { HistoryPage } from '@/features/history/HistoryPage';
import { SettingsPage } from '@/features/settings/SettingsPage';
import { AboutPage } from '@/features/about/AboutPage';
import { WorkspacesPage } from '@/features/workspaces/WorkspacesPage';
import { WorkspaceDetailPage } from '@/features/workspaces/WorkspaceDetailPage';
import { PluginsPage } from '@/features/plugins/PluginsPage';
import { PluginRunner } from '@/features/plugins/PluginRunner';
import { PlaybooksDashboard, PlaybookRunner } from '@/features/playbooks/PlaybooksPage';
import HttpClientTool from '@/features/networking/http-client/Tool';

// Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Root route with layout
const rootRoute = createRootRoute({
  component: RootLayout,
});

// Page routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
});

const allToolsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tools',
  component: AllTools,
});

const toolRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tools/$toolId',
  component: function ToolPage() {
    const { toolId } = toolRoute.useParams();
    const tool = toolRegistry.getById(toolId);

    if (!tool) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-lg font-medium text-text">Tool not found</p>
            <p className="text-sm text-text-secondary mt-1">The tool "{toolId}" does not exist.</p>
          </div>
        </div>
      );
    }

    const ToolComponent = tool.component;
    return (
      <Suspense fallback={
        <div className="flex items-center justify-center h-full text-text-muted text-sm py-12">
          Loading tool interface...
        </div>
      }>
        <ToolComponent />
      </Suspense>
    );
  },
});

const favoritesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/favorites',
  component: FavoritesPage,
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/history',
  component: HistoryPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

const workspacesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/workspaces',
  component: WorkspacesPage,
});

const workspaceDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/workspaces/$workspaceId',
  component: function WorkspaceDetailRouteComponent() {
    const { workspaceId } = workspaceDetailRoute.useParams();
    return <WorkspaceDetailPage workspaceId={workspaceId} />;
  },
});

const pluginsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/plugins',
  component: PluginsPage,
});

const pluginRunnerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/plugins/$pluginId',
  component: function PluginRunnerRouteComponent() {
    const { pluginId } = pluginRunnerRoute.useParams();
    return <PluginRunner pluginId={pluginId} />;
  },
});

const playbooksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/playbooks',
  component: PlaybooksDashboard,
});

const playbookRunnerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/playbooks/$playbookId',
  component: function PlaybookRunnerRouteComponent() {
    const { playbookId } = playbookRunnerRoute.useParams();
    return <PlaybookRunner playbookId={playbookId} />;
  },
});

const httpClientRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tools/http-client',
  component: HttpClientTool,
});

// Build route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  allToolsRoute,
  toolRoute,
  favoritesRoute,
  historyRoute,
  settingsRoute,
  aboutRoute,
  workspacesRoute,
  workspaceDetailRoute,
  pluginsRoute,
  pluginRunnerRoute,
  playbooksRoute,
  playbookRunnerRoute,
  httpClientRoute,
]);

const hashHistory = createHashHistory();

const router = createRouter({
  routeTree,
  history: hashHistory,
  defaultPreload: 'intent',
});

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WorkspaceProvider>
        <RouterProvider router={router} />
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: 'toast-custom',
            duration: 2000,
            style: {
              background: '#161B22',
              color: '#E6EDF3',
              border: '1px solid #30363D',
              borderRadius: '10px',
              fontSize: '13px',
            },
          }}
        />
      </WorkspaceProvider>
    </QueryClientProvider>
  );
}
