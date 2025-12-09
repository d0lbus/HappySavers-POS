export default function NotAuthorizedPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-red-600">Not Authorized</h1>
      <p className="text-slate-600 mt-2">
        You do not have permission to access this page.
      </p>
    </div>
  );
}
