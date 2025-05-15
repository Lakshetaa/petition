import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft, ThumbsUp, Edit, Trash2, Users, Clock } from 'lucide-react';
import { petitionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout/Layout';
import Button from '../components/UI/Button';

const PetitionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [petition, setPetition] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPetition = async () => {
      try {
        if (!id) return;
        setLoading(true);
        const data = await petitionAPI.getById(id);
        setPetition(data);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to fetch petition');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchPetition();
  }, [id, navigate]);

  const hasVoted = user && petition?.votes.some((vote: any) => 
    vote.user === user._id
  );

  const isOwner = user && petition?.user._id === user._id;

  const handleVote = async () => {
    if (!user) {
      toast.error('Please log in to vote');
      return;
    }
    
    if (hasVoted) {
      toast.error('You have already voted on this petition');
      return;
    }
    
    try {
      setIsVoting(true);
      const updatedPetition = await petitionAPI.vote(petition._id);
      setPetition(updatedPetition);
      toast.success('Vote submitted successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to vote');
    } finally {
      setIsVoting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this petition?')) {
      return;
    }
    
    try {
      setIsDeleting(true);
      await petitionAPI.delete(petition._id);
      toast.success('Petition deleted successfully');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete petition');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!petition) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Petition Not Found</h2>
            <p className="text-gray-600 mb-4">The petition you're looking for doesn't exist or has been removed.</p>
            <Link to="/" className="text-teal-600 hover:text-teal-700 font-medium">
              Back to Home
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const progress = Math.min(
    Math.round((petition.votes.length / petition.voteGoal) * 100),
    100
  );
  
  const formattedDate = new Date(petition.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-teal-600 hover:text-teal-700 mb-6">
          <ArrowLeft size={16} className="mr-1" /> Back to petitions
        </Link>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap justify-between items-start mb-4">
              <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full mb-2 md:mb-0">
                {petition.category}
              </span>
              
              {isOwner && (
                <div className="flex space-x-2">
                  <Link
                    to={`/edit-petition/${petition._id}`}
                    className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    <Edit size={16} className="mr-1" /> Edit
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleDelete}
                    isLoading={isDeleting}
                    className="inline-flex items-center"
                  >
                    <Trash2 size={16} className="mr-1" /> Delete
                  </Button>
                </div>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{petition.title}</h1>
            
            <div className="flex items-center text-gray-600 mb-6 space-x-4">
              <span className="flex items-center">
                <Users size={18} className="mr-1" /> 
                Started by {petition.user.fullName}
              </span>
              <span className="flex items-center">
                <Clock size={18} className="mr-1" /> 
                {formattedDate}
              </span>
            </div>
            
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-lg font-medium text-gray-700">
                  {petition.votes.length} of {petition.voteGoal} signatures
                </span>
                <span className="text-lg font-medium text-gray-700">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-teal-600 h-4 rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="prose max-w-none mb-8">
              <p className="text-gray-700 whitespace-pre-line">{petition.description}</p>
            </div>
            
            <div className="mt-8">
              <Button
                onClick={handleVote}
                disabled={!user || hasVoted || isVoting}
                isLoading={isVoting}
                fullWidth
                size="lg"
                className="flex items-center justify-center"
              >
                <ThumbsUp size={20} className="mr-2" />
                {hasVoted ? 'You\'ve Signed This Petition' : 'Sign This Petition'}
              </Button>
              
              {!user && (
                <p className="text-center text-gray-600 mt-4">
                  Please <Link to="/login" className="text-teal-600 hover:text-teal-700">log in</Link> to sign this petition
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PetitionDetailPage;