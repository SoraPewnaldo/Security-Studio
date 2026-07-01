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

// Lazy-loaded pages
import { Dashboard } from '@/features/dashboard/Dashboard';
import { AllTools } from '@/features/all-tools/AllTools';
import { FavoritesPage } from '@/features/favorites/FavoritesPage';
import { HistoryPage } from '@/features/history/HistoryPage';
import { SettingsPage } from '@/features/settings/SettingsPage';
import { AboutPage } from '@/features/about/AboutPage';

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
    return <ToolComponent />;
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

// Build route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  allToolsRoute,
  toolRoute,
  favoritesRoute,
  historyRoute,
  settingsRoute,
  aboutRoute,
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
    </QueryClientProvider>
  );
}
