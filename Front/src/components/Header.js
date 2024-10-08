import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../components/styles/Header.css';
import logo from '../img/logo_horizontal.png';
import icon_seta from '../img/seta-para-baixo.png';
import icon_perfil from '../img/perfil.png';
import icon_sair from '../img/sair.png';

function Header() {
  const [userName, setUserName] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fullName = sessionStorage.getItem('userName');
    if (fullName) {
      const firstName = fullName.split(' ')[0];
      setUserName(firstName);
    }
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
    document.body.style.overflow = dropdownVisible ? 'auto' : 'hidden';
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);
      document.body.style.overflow = 'auto';
    }
  };

  useEffect(() => {
    if (dropdownVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownVisible]);

  return (
    <header className="app-header">
      <img src={logo} className="logo" alt="Logo Checkfy" />
      <div className="container-header">
        <div className='links-header'>
          <Link to="/" className="link-header">Home</Link>
          <Link to="/sobre" className="link-header">Sobre</Link>
          <Link to="/documentos" className="link-header">Documentos</Link>
          <div className={`dropdown ${dropdownVisible ? 'show' : ''}`} ref={dropdownRef}>
            <button className="dropbtn" onClick={toggleDropdown}>
              <p className='info-user'>Olá, {userName}</p>
              <img className='icone-usuario' src={icon_seta} alt="Seta para baixo" />
            </button>
            <div className="dropdown-content">
              <Link to="/perfil">
                <img className='icones-opcoes-usuario' src={icon_perfil} alt="Perfil" />Perfil
              </Link>
              <Link to="/login-cadastro">
                <img className='icones-opcoes-usuario' src={icon_sair} alt="Sair" />Sair
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;