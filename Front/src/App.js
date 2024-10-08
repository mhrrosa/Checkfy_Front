import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Sobre from './pages/Sobre';
import CreateEvaluation from './pages/CreateEvaluation';
import Evaluation from './pages/Evaluation';
import DetailsEvaluation from './pages/detailsEvaluation';
import UpdateEvaluation from './pages/UpdateEvaluation';
import Results from './pages/Results';
import LoginCadastro from './pages/LoginCadastro';
import Gerenciamento from './pages/Gerenciamento';
import Niveis from './pages/Niveis';
import Processos from './pages/Processos';
import ResultadosEsperados from './pages/ResultadosEsperados';
import ProtectedRoute from './components/ProtectedRoute';
import { UserContext } from './contexts/UserContext'; // Importando o contexto

function App() {
  const location = useLocation();
  const isLoginCadastro = location.pathname === '/login-cadastro';
  const { userType } = React.useContext(UserContext); // Usando o contexto para verificar o tipo de usuário

  return (
    <div id="app-container">
      {!isLoginCadastro && <Header />}
      <div id="content-wrap">
        <Routes>
          <Route path="/login-cadastro" element={<LoginCadastro />} />
          
          {/* Redirecionamento da raiz para /home */}
          <Route 
            path="/" 
            element={<Navigate to="/home" replace />} 
          />

          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/sobre" 
            element={
              <ProtectedRoute>
                <Sobre />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/create-evaluation" 
            element={
              <ProtectedRoute>
                <CreateEvaluation />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/evaluation" 
            element={
              <ProtectedRoute>
                <Evaluation />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/details-evaluation"
            element={
              <ProtectedRoute>
                <DetailsEvaluation />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/update-evaluation" 
            element={
              <ProtectedRoute>
                <UpdateEvaluation />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/results" 
            element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/gerenciamento" 
            element={
              <ProtectedRoute>
                <Gerenciamento />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/niveis" 
            element={
              <ProtectedRoute>
                <Niveis />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/processos" 
            element={
              <ProtectedRoute>
                <Processos />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/resultados-esperados" 
            element={
              <ProtectedRoute>
                <ResultadosEsperados />
              </ProtectedRoute>
            } 
          />

          {/* Rota "catch-all" para rotas inexistentes */}
          <Route 
            path="*" 
            element={
              userType 
                ? <Navigate to="/home" replace />  // Se estiver logado, redireciona para /home
                : <Navigate to="/login-cadastro" replace />  // Se não estiver logado, redireciona para /login-cadastro
            } 
          />
        </Routes>
      </div>
      {!isLoginCadastro && <Footer />}
    </div>
  );
}

export default App;