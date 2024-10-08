import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../pages/styles/Sobre.css';
import capa from '../img/capa_checkfy.jpg';

function Sobre() {
    return (
        <div className="body-sobre">
            <div className="container-sobre">
                <img src={capa} alt="Descrição da imagem" className="imagem-sobre" />
                <div className="container-texto-sobre">
                    <h1 className='titulo-sobre'>Sobre a Checkfy</h1>
                    <p className='texto-sobre'>
                        A Checkfy é uma plataforma inovadora projetada para transformar a maneira como as 
                        empresas realizam avaliações de processos de software, conforme o modelo MPS.BR. Nosso
                        objetivo é modernizar e simplificar o processo de avaliação, que historicamente é realizado
                        através de planilhas e documentos dispersos. Com o Checkfy, trazemos uma solução digital
                        completa, intuitiva e centralizada.
                    </p>
                    <h2 className='subtitulo-sobre'>MPS.BR</h2>
                    <p className='texto-sobre'>
                        O MPS.BR (Melhoria de Processo do Software Brasileiro) é um modelo de referência que define
                        práticas e métodos para melhorar a qualidade de processos e produtos de software em
                        organizações. No entanto, o processo de avaliação tem sido, até hoje, uma tarefa trabalhosa e
                        manual, dependente de diversas ferramentas, como o Excel. O Checkfy surge como uma solução
                        para eliminar essa complexidade, reunindo tudo em uma plataforma online moderna.
                    </p>
                    <h2 className='subtitulo-sobre'>Nossa Missão</h2>
                    <p className='texto-sobre'>
                        A missão da Checkfy é facilitar e otimizar o trabalho dos avaliadores e das empresas que buscam
                        certificação MPS.BR, oferecendo um sistema eficiente, confiável e prático. Acreditamos que, ao
                        digitalizar este processo, não apenas reduzimos o tempo necessário para concluir avaliações, mas
                        também aumentamos a precisão e a organização dos dados.
                    </p>
                    <h2 className='subtitulo-sobre'>Projeto Acadêmico</h2>
                    <p className='texto-sobre'>
                        A Checkfy é fruto do nosso Projeto Final do curso de Engenharia de Software. O sistema foi
                        cuidadosamente projetado para atender às necessidades reais dos avaliadores e organizações que
                        se comprometem com a melhoria contínua de processos de software. Cada funcionalidade foi
                        desenvolvida com foco na usabilidade, praticidade e escalabilidade, a fim de garantir que o sistema
                        se adapte facilmente a diferentes contextos e organizações.
                    </p>
                    <h2 className='subtitulo-sobre'>Por que escolher a Checkfy?</h2>
                    <ul className='texto-sobre'>
                        <li>Automação: Reduz o esforço manual de consolidação de dados.</li>
                        <li>Centralização: Todos os documentos e informações de avaliação em um só lugar.</li>
                        <li>Acessibilidade: Plataforma web de fácil acesso e navegação.</li>
                        <li>Agilidade: Acelera o processo de avaliação e emissão de relatórios.</li>
                        <li>Precisão: Minimizamos erros humanos ao automatizar grande parte do processo.</li>
                    </ul>
                    <p className='texto-sobre'>
                        Estamos comprometidos em entregar uma ferramenta que faça a diferença no dia a dia dos avaliadores
                        e empresas que buscam a excelência em seus processos de desenvolvimento de software.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Sobre;