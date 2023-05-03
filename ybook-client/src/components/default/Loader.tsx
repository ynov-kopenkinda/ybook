export function Loader() {
  return (
    <div className="flex items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-gray-900"></div>
    </div>
  );
}

export function CenterLoader() {
  return (
    <div className="flex items-center justify-center p-4">
      <Loader />
    </div>
  );
}
