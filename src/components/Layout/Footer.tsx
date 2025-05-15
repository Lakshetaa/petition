import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-teal-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">PetitionPlatform</h3>
            <p className="text-teal-100">
              Empowering voices, creating change. Join our community of changemakers today.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-teal-100 hover:text-white transition-colors">Browse Petitions</a></li>
              <li><a href="/create-petition" className="text-teal-100 hover:text-white transition-colors">Start a Petition</a></li>
              <li><a href="/dashboard" className="text-teal-100 hover:text-white transition-colors">Your Dashboard</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p className="text-teal-100 mb-2">support@petitionplatform.com</p>
            <p className="text-teal-100">123 Advocacy Street, Change City</p>
          </div>
        </div>
        
        <div className="border-t border-teal-600 mt-8 pt-6 text-center">
          <p className="flex items-center justify-center text-teal-100">
            Made with <Heart size={16} className="mx-1 text-red-400" fill="currentColor" /> in 2025
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;