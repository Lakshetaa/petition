import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { AlertTriangle } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-320px)] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle size={64} className="text-amber-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="inline-block bg-teal-600 text-white px-6 py-3 rounded-md hover:bg-teal-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFoundPage;