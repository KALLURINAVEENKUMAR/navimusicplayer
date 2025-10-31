import React from 'react';
import { Heart } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <div className="footer">
      <p className="footer__text">
        Made with{' '}
        <Heart size={16} className="footer__heart" fill="#ff0000" color="#ff0000" />{' '}
        Naveenkumar Kalluri
      </p>
    </div>
  );
};

export default Footer;