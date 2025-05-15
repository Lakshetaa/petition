import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'react-hot-toast';
import { PlusCircle } from 'lucide-react';
import { petitionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout/Layout';
import PetitionCard from '../components/UI/PetitionCard';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('my-petitions');
  const [myPetitions, setMyPetitions] = useState([]);
  const [votedPetitions, setVotedPetitions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (activeTab === 'my-petitions') {
          const data = await petitionAPI.getUserPetitions();
          setMyPetitions(data);
        } else {
          const data = await petitionAPI.getUserVotedPetitions();
          setVotedPetitions(data);
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [activeTab, user, navigate]);
  
  const refreshPetitions = async () => {
    try {
      if (activeTab === 'my-petitions') {
        const data = await petitionAPI.getUserPetitions();
        setMyPetitions(data);
      } else {
        const data = await petitionAPI.getUserVotedPetitions();
        setVotedPetitions(data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to refresh data');
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Your Dashboard</h1>
            <p className="text-gray-600">
              Manage your petitions and track your signatures
            </p>
          </div>
          <Link
            to="/create-petition"
            className="mt-4 md:mt-0 inline-flex items-center bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
          >
            <PlusCircle size={18} className="mr-2" /> Create New Petition
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'my-petitions'
                    ? 'border-b-2 border-teal-600 text-teal-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('my-petitions')}
              >
                My Petitions
              </button>
              <button
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'my-votes'
                    ? 'border-b-2 border-teal-600 text-teal-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('my-votes')}
              >
                My Signatures
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
              </div>
            ) : activeTab === 'my-petitions' ? (
              <>
                {myPetitions.length === 0 ? (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-medium text-gray-700 mb-2">
                      You haven't created any petitions yet
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Start your first petition and make your voice heard
                    </p>
                    <Link
                      to="/create-petition"
                      className="inline-flex items-center bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
                    >
                      <PlusCircle size={18} className="mr-2" /> Create New Petition
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {myPetitions.map((petition: any) => (
                      <PetitionCard
                        key={petition._id}
                        petition={{
                          ...petition,
                          user: user ? { _id: user._id, username: user.username, fullName: user.fullName } : petition.user,
                        }}
                        onVoteSuccess={refreshPetitions}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                {votedPetitions.length === 0 ? (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-medium text-gray-700 mb-2">
                      You haven't signed any petitions yet
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Explore petitions and support causes you care about
                    </p>
                    <Link
                      to="/"
                      className="inline-flex items-center bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
                    >
                      Browse Petitions
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {votedPetitions.map((petition: any) => (
                      <PetitionCard
                        key={petition._id}
                        petition={petition}
                        onVoteSuccess={refreshPetitions}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;