import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from '../services/Api';
import { UserContext } from '../contexts/UserContext'; // Importe o UserContext
import '../components/styles/Body.css';
import '../components/styles/Button.css';
import '../components/styles/Container.css';
import '../pages/styles/LoginCadastro.css';
import logo from '../img/logo_horizontal.png';

const LoginCadastro = () => {
  const navigate = useNavigate();
  const { setUserId, setUserType, setUserName } = useContext(UserContext); // Obtenha setUserId, setUserType e setUserName do contexto

  const [formData, setFormData] = useState({
    nome: '',
    cargo: '',
    email: '',
    senha: ''
  });

  const [isSignUp, setIsSignUp] = useState(false); // Estado para controlar se está na tela de SignUp

  useEffect(() => {
    const btnSignin = document.querySelector("#signin");
    const btnSignup = document.querySelector("#signup");
    const body = document.querySelector("body");

    const handleSigninClick = () => {
      body.className = "sign-in-js";
      setIsSignUp(false); // Muda para o modo de Login
    };

    const handleSignupClick = () => {
      body.className = "sign-up-js";
      setIsSignUp(true); // Muda para o modo de SignUp
    };

    if (btnSignin) {
      btnSignin.addEventListener("click", handleSigninClick);
    }

    if (btnSignup) {
      btnSignup.addEventListener("click", handleSignupClick);
    }

    return () => {
      if (btnSignin) {
        btnSignin.removeEventListener("click", handleSigninClick);
      }
      if (btnSignup) {
        btnSignup.removeEventListener("click", handleSignupClick);
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();  // Previne o comportamento padrão de recarregar a página
    try {
        const response = await loginUser(formData.email, formData.senha);  // Chama a função loginUser com os dados corretos
        if (response.status === 200) {
            localStorage.setItem('userType', response.user_type);
            sessionStorage.setItem('userId', response.user_id);
            setUserType(response.user_type);  // Atualiza o UserContext
            setUserName(response.nome);
            navigate('/home');  // Redireciona para a home page
        } else {
            console.error('Erro de login:', response.message);
        }
    } catch (error) {
        console.error('Erro ao realizar login:', error);
    }
};

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
        const response = await registerUser(formData);
        if (response.user_id) {
            await handleLogin(e);  // Faz login automaticamente após o registro
        }
    } catch (error) {
        console.error('Erro ao registrar o usuário:', error);
    }
  };

  return (
    <div className="container-login">
      <div className="content first-content">
        <div className="first-column">
          <img src={logo} className="logo-login" alt="Logo Checkfy" />
          <h2 className="title title-primary">Bem-vindo de Volta!</h2>
          <p className="description description-primary">Para se manter conectado conosco</p>
          <p className="description description-primary">Por favor faça login com suas informações pessoais</p>
          <button id="signin" className="button button-primary">Fazer login</button>
        </div>
        <div className="second-column">
          <h2 className="title title-second">Criar Conta</h2>
          <p className="description description-second">Insira seus dados pessoais para cadastro</p>
          <form className="form" onSubmit={handleRegister}>
            <label className="label-input" htmlFor="nome">
              <i className="fas fa-user icon-modify"></i>
              <input
                type="text"
                placeholder="Nome Completo"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange} 
              />
            </label>
            <label className="label-input" htmlFor="cargo">
              <i className="fas fa-briefcase icon-modify"></i>
              <select
                name="cargo"
                value={formData.cargo}
                onChange={handleInputChange} 
              >
                <option value="" disabled>Cargo</option>
                <option value="Avaliador">Avaliador</option>
                <option value="Auditor">Auditor</option>
                <option value="Patrocinador">Patrocinador</option>
                <option value="Colaborador">Colaborador</option>
              </select>
            </label>
            <label className="label-input" htmlFor="email">
              <i className="far fa-envelope icon-modify"></i>
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange} 
              />
            </label>
            <label className="label-input" htmlFor="senha">
              <i className="fas fa-lock icon-modify"></i>
              <input
                type="password"
                placeholder="Senha"
                name="senha"
                value={formData.senha}
                onChange={handleInputChange} 
              />
            </label>
            <button className="button button-second">Cadastrar</button>
          </form>
        </div>
      </div>
      <div className="content second-content">
        <div className="first-column">
          <img src={logo} className="logo-login" alt="Logo Checkfy" />
          <h2 className="title title-primary">Olá, seja bem-vindo!</h2>
          <p className="description description-primary">É novo por aqui? Clique no botão abaixo</p>
          <p className="description description-primary">Inicie sua jornada na alta maturidade de processos</p>
          <button id="signup" className="button button-primary">Cadastrar-se</button>
        </div>
        <div className="second-column">
          <h2 className="title title-second">Faça seu login</h2>
          <p className="description description-second">Insira seus dados pessoais</p>
          <form className="form" onSubmit={handleLogin}>
            <label className="label-input" htmlFor="email">
              <i className="far fa-envelope icon-modify"></i>
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange} 
              />
            </label>
            <label className="label-input" htmlFor="senha">
              <i className="fas fa-lock icon-modify"></i>
              <input
                type="password"
                placeholder="Senha"
                name="senha"
                value={formData.senha}
                onChange={handleInputChange} 
              />
            </label>
            <a className="password" href="/">Esqueceu sua senha?</a>
            <button className="button button-second">Entrar</button>
          </form> 
        </div>
      </div>
    </div>
  );
}

export default LoginCadastro;