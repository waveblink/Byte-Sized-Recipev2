import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import '../styles/styles.scss'; // Adjust the path as necessary



function FooterIcons() {
    const handleClick = (url) => {
      window.open(url, "_blank");
    };
  
    return (
      <div>
        <button className="raise" onClick={() => handleClick("https://github.com/waveblink")} aria-label="Github">
          <FaGithub size={30} />
        </button>
        <button className="raise" onClick={() => handleClick("https://www.linkedin.com/in/maxwell-hahn")} aria-label="LinkedIn">
          <FaLinkedin size={30} />
        </button>
      </div>
    );
  }
  

export default FooterIcons;
