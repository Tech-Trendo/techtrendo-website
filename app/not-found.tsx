import { FileText } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-blue-50 to-white">
      <main className="grow flex items-center justify-center px-4 mt-12 mb-12">
        <div className="bg-white rounded-xl shadow-xl p-10 flex flex-col items-center text-center max-w-sm w-full">
          <div className="text-blue-500 mb-6">
            <FileText size={60} />
          </div>

          <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>

          <p className="text-gray-600 mb-6">
            Page Not Found
            <br />
            The page you are looking for might be removed or does not exist.
          </p>

          <a
            href="/"
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300"
          >
            GO HOME
          </a>
        </div>
      </main>

      <div className="mt-12"></div>
    </div>
  );
}