import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { petitionAPI } from '../services/api';
import Layout from '../components/Layout/Layout';
import PetitionCard from '../components/UI/PetitionCard';
import CategoryFilter from '../components/UI/CategoryFilter';
import SearchBar from '../components/UI/SearchBar';

const HomePage = () => {
  const [petitions, setPetitions] = useState([]);
  const [filteredPetitions, setFilteredPetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPetitions = async () => {
      try {
        setLoading(true);
        const data = await petitionAPI.getAll(category || undefined);
        setPetitions(data);
        setFilteredPetitions(data);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to fetch petitions');
      } finally {
        setLoading(false);
      }
    };

    fetchPetitions();
  }, [category]);

  useEffect(() => {
    if (searchTerm) {
      const results = petitions.filter((petition: any) =>
        petition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        petition.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPetitions(results);
    } else {
      setFilteredPetitions(petitions);
    }
  }, [searchTerm, petitions]);

  const handleCategoryChange = (newCategory: string | null) => {
    setCategory(newCategory);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const refreshPetitions = async () => {
    try {
      const data = await petitionAPI.getAll(category || undefined);
      setPetitions(data);
      setFilteredPetitions(
        searchTerm 
          ? data.filter((petition: any) =>
              petition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              petition.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
          : data
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to refresh petitions');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Make Your Voice Heard</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of people creating change through petitions. Browse, sign, or start your own petition today.
          </p>
        </div>

        <SearchBar onSearch={handleSearch} />
        <CategoryFilter onCategoryChange={handleCategoryChange} />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
          </div>
        ) : filteredPetitions.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700 mb-2">No petitions found</h3>
            <p className="text-gray-500">
              {searchTerm || category
                ? 'Try adjusting your filters or search terms'
                : 'Be the first to create a petition!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPetitions.map((petition: any) => (
              <PetitionCard 
                key={petition._id} 
                petition={petition} 
                onVoteSuccess={refreshPetitions}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HomePage;