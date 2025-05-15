import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { petitionAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface PetitionCardProps {
  petition: {
    _id: string;
    title: string;
    description: string;
    category: string;
    voteGoal: number;
    votes: { user: string }[];
    user: {
      _id: string;
      username: string;
      fullName: string;
    };
    createdAt: string;
  };
  onVoteSuccess?: () => void;
}

const PetitionCard = ({ petition, onVoteSuccess }: PetitionCardProps) => {
  const [isVoting, setIsVoting] = useState(false);
  const { user } = useAuth();
  
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  const progress = Math.min(
    Math.round((petition.votes.length / petition.voteGoal) * 100),
    100
  );
  
  const hasVoted = user && petition.votes.some(vote => 
    vote.user === user._id
  );
  
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
      await petitionAPI.vote(petition._id);
      toast.success('Vote submitted successfully!');
      if (onVoteSuccess) onVoteSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to vote');
    } finally {
      setIsVoting(false);
    }
  };
  
  const formattedDate = new Date(petition.createdAt).toLocaleDateString();
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
            {petition.category}
          </span>
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>
        
        <Link to={`/petition/${petition._id}`}>
          <h3 className="text-xl font-bold text-gray-800 mb-2 hover:text-teal-700 transition-colors">
            {petition.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 mb-4">
          {truncateText(petition.description, 150)}
        </p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span>By {petition.user.fullName}</span>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 flex items-center">
              <Users size={16} className="mr-1" /> {petition.votes.length} of {petition.voteGoal} signatures
            </span>
            <span className="text-sm font-medium text-gray-700">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-teal-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <Link 
            to={`/petition/${petition._id}`}
            className="text-teal-700 hover:text-teal-900 font-medium transition-colors"
          >
            View Details
          </Link>
          
          <button
            onClick={handleVote}
            disabled={!user || hasVoted || isVoting}
            className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              hasVoted
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'bg-teal-600 text-white hover:bg-teal-700'
            }`}
          >
            <ThumbsUp size={16} className="mr-1" />
            {hasVoted ? 'Signed' : 'Sign Petition'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PetitionCard;