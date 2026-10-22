import AdminDashboard from "./AdminDashboard";

// Middleware makes sure only a signed-in admin reaches this page.
export default function AdminPage() {
  return <AdminDashboard />;
}
