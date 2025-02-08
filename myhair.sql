-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 07/02/2025 às 15:28
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `myhair`
--

DELIMITER $$
--
-- Procedimentos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `AdicionarCompetenciaPorServico` (IN `p_id_profissional` INT, IN `p_id_servico` INT)   BEGIN
    DECLARE v_id_competencia INT;

    -- Verifica se a competência já existe para o profissional e o serviço
    SELECT C.ID INTO v_id_competencia
    FROM Competencia C
    WHERE C.ID_P = p_id_profissional 
      AND C.ID_S = p_id_servico;  -- Verifica pelo ID do serviço

    IF v_id_competencia IS NULL THEN
        -- Insere a nova competência se não existir
        INSERT INTO Competencia (ID_P, ID_S)  -- Adiciona o ID do serviço
        VALUES (p_id_profissional, p_id_servico);
    ELSE
        -- Se a competência já existir, gera um erro
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Erro: Competência já existe para este profissional e serviço.';
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `AgendarServicoPorNome` (IN `p_nome_cliente` VARCHAR(100), IN `p_nome_profissional` VARCHAR(100), IN `p_nome_servico` VARCHAR(50), IN `p_hora` TIME, IN `p_data` DATE)   BEGIN
    DECLARE v_id_cliente INT;
    DECLARE v_id_profissional INT;
    DECLARE v_id_servico INT;
    SELECT C.ID INTO v_id_cliente
    FROM Cliente C
    INNER JOIN Usuario U ON C.ID_U = U.ID
    WHERE U.Nome = p_nome_cliente;
    SELECT P.ID INTO v_id_profissional
    FROM Profissional P
    INNER JOIN Usuario U ON P.ID_U = U.ID
    WHERE U.Nome = p_nome_profissional;
    SELECT S.ID INTO v_id_servico
    FROM Servico S
    WHERE S.Nome_S = p_nome_servico;
    IF v_id_cliente IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Erro: Cliente não encontrado.';
    END IF;
    IF v_id_profissional IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Erro: Profissional não encontrado.';
    END IF;
    IF v_id_servico IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Erro: Serviço não encontrado.';
    END IF;
    INSERT INTO Agenda (ID_C, ID_S, ID_P, Status, Hora, Dati)
    VALUES (v_id_cliente, v_id_servico, v_id_profissional, true, p_hora, p_data);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `BuscarAgendamentosPorProfissional` (IN `p_id_profissional` INT)   BEGIN
    -- Verifica se o profissional existe
    IF NOT EXISTS (SELECT 1 FROM profissional WHERE ID = p_id_profissional) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Erro: Profissional não encontrado.';
    END IF;

    -- Seleciona os agendamentos do profissional
    SELECT 
        a.ID AS ID_Agendamento,
        c.ID AS ID_Cliente,
        u_c.Nome AS Nome_Cliente,
        s.Nome_S AS Nome_Servico,
        a.Hora,
        a.Dati,
        CASE 
            WHEN a.Status = 1 THEN 'Ativo' 
            ELSE 'Inativo' 
        END AS Status_Agendamento
    FROM 
        agenda a
    JOIN 
        cliente c ON a.ID_C = c.ID
    JOIN 
        usuario u_c ON c.ID_U = u_c.ID
    JOIN 
        servico s ON a.ID_S = s.ID
    WHERE 
        a.ID_P = p_id_profissional;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `CriarUsuario` (IN `p_nome` VARCHAR(50), IN `p_senha` VARCHAR(255))   BEGIN
    INSERT INTO Usuario (Nome, Senha)
    VALUES (p_nome, p_senha);
 
    SELECT LAST_INSERT_ID() AS ID_Usuario;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GerenciarServico` (IN `p_id_servico` INT, IN `p_nome_servico` VARCHAR(50), IN `p_preco` FLOAT, IN `p_duracao` TIME, IN `p_acao` VARCHAR(10))   BEGIN
    IF p_acao = 'adicionar' THEN
        INSERT INTO Servico (Nome_S, Preco, Duracao) 
        VALUES (p_nome_servico, p_preco, p_duracao);
        SELECT LAST_INSERT_ID() AS ID_Servico;
    ELSEIF p_acao = 'atualizar' THEN
        UPDATE Servico 
        SET Nome_S = p_nome_servico, Preco = p_preco, Duracao = p_duracao 
        WHERE ID = p_id_servico;
        IF ROW_COUNT() = 0 THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Erro: Serviço não encontrado.';
        END IF;
    ELSE 
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Erro: Ação inválida. Use "adicionar" ou "atualizar".';
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAdmByUserId` (IN `p_id_usuario` INT)   BEGIN
    SELECT Adm FROM profissional WHERE ID_U = p_id_usuario;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `InserirUsuarioProfissionalContato` (IN `p_nome` VARCHAR(255), IN `p_senha` VARCHAR(255), IN `p_celular` VARCHAR(20), IN `p_email` VARCHAR(255), IN `p_adm` TINYINT(1))   BEGIN
    DECLARE v_usuario_id INT;
    DECLARE v_profissional_id INT;

    -- Inserir na tabela Usuario
    INSERT INTO Usuario (nome, senha) VALUES (p_nome, p_senha);
    SET v_usuario_id = LAST_INSERT_ID();

    -- Inserir na tabela Profissional (Removendo senha duplicada)
    INSERT INTO Profissional (ID_U, Adm) VALUES (v_usuario_id, p_adm);
    SET v_profissional_id = LAST_INSERT_ID();

    -- Inserir na tabela Contato com o ID correto de Profissional
    INSERT INTO Contato (ID_U, Celular, Email) VALUES (v_usuario_id, p_celular, p_email);

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ObterNomesProfissionais` ()   BEGIN
    -- Seleciona os nomes de todos os profissionais
    SELECT u.Nome AS Nome_Profissional
    FROM profissional p
    JOIN usuario u ON p.ID_U = u.ID;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `TransformarUsuarioEmCliente` (`p_nome_usuario` VARCHAR(255))   BEGIN
    DECLARE v_id_usuario INT;
    SELECT U.ID INTO v_id_usuario
    FROM Usuario U
    WHERE U.Nome = p_nome_usuario;
    IF v_id_usuario IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Erro: Usuário não encontrado.';
    ELSE
        INSERT INTO Cliente (ID_U, Status)
        VALUES (v_id_usuario, 'Cliente'); 
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `TransformarUsuarioEmProfissional` (`p_nome_usuario` VARCHAR(255))   BEGIN
    DECLARE v_id_usuario INT;
    SELECT U.ID INTO v_id_usuario
    FROM Usuario U
    WHERE U.Nome = p_nome_usuario;
    IF v_id_usuario IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Erro: Usuário não encontrado.';
    ELSE
        INSERT INTO Profissional (ID_U, Adm, SenhaAdm)
        VALUES (v_id_usuario, FALSE, NULL); 
    END IF;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `agenda`
--

CREATE TABLE `agenda` (
  `ID` int(11) NOT NULL,
  `ID_C` int(11) DEFAULT NULL,
  `ID_S` int(11) DEFAULT NULL,
  `ID_P` int(11) DEFAULT NULL,
  `Status` tinyint(1) DEFAULT NULL,
  `Hora` time DEFAULT NULL,
  `Dati` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `agenda`
--

INSERT INTO `agenda` (`ID`, `ID_C`, `ID_S`, `ID_P`, `Status`, `Hora`, `Dati`) VALUES
(1, 1, 1, 1, 1, '10:30:00', '2011-05-20'),
(2, 1, 1, 1, 1, '11:30:00', '2025-01-23'),
(3, 6, 1, 1, 1, '11:30:00', '2025-01-25'),
(4, 13, 1, 2, 1, '18:32:00', '2025-01-28');

-- --------------------------------------------------------

--
-- Estrutura para tabela `cliente`
--

CREATE TABLE `cliente` (
  `ID` int(11) NOT NULL,
  `ID_U` int(11) DEFAULT NULL,
  `Status` enum('Cliente','Profissional') DEFAULT 'Cliente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `cliente`
--

INSERT INTO `cliente` (`ID`, `ID_U`, `Status`) VALUES
(1, 1, 'Profissional'),
(2, 4, 'Profissional'),
(3, 5, 'Profissional'),
(4, 6, 'Profissional'),
(5, 7, 'Profissional'),
(6, 8, 'Profissional'),
(8, 10, 'Profissional'),
(11, 11, 'Cliente'),
(13, 12, 'Cliente'),
(15, 15, 'Cliente');

-- --------------------------------------------------------

--
-- Estrutura para tabela `competencia`
--

CREATE TABLE `competencia` (
  `id` int(11) NOT NULL,
  `ID_P` int(11) DEFAULT NULL,
  `ID_S` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `competencia`
--

INSERT INTO `competencia` (`id`, `ID_P`, `ID_S`) VALUES
(1, 7, 1),
(2, 3, 3),
(3, 2, 4),
(4, 1, 5);

-- --------------------------------------------------------

--
-- Estrutura para tabela `contato`
--

CREATE TABLE `contato` (
  `ID` int(11) NOT NULL,
  `Email` varchar(50) DEFAULT NULL,
  `Celular` char(11) DEFAULT NULL,
  `ID_U` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `contato`
--

INSERT INTO `contato` (`ID`, `Email`, `Celular`, `ID_U`) VALUES
(1, 'Zeca@gmail.com', '11987854567', 1),
(3, 'teste@email.com', '999999999', 51),
(24, 'kaue@gmail.com', '(11)9880113', 72),
(29, 'tela@gmail.com', '(11)9880113', 77),
(30, 'samuel@gmail.com', '(11)9880113', 78),
(34, 'mari@gmail.com', '(11)9880113', 83),
(35, 'mario@gmail.com', '(11)9880113', 84),
(36, 'manu@gmail.com', '(11)9880113', 85),
(37, 'hita@gmail.com', '11988012307', 86),
(38, 'mah@gmail.com', '(11)9880113', 87),
(39, 'carlos@gmail.com', '(11)9880113', 88),
(40, 'Igor@gmail.com', '(11)9880113', 89),
(41, 'belo@gmail.com', '(11)9880113', 90),
(42, 'belo@gmail.com', '(11)9880113', 91);

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `disponibilidadeprofissional`
-- (Veja abaixo para a visão atual)
--
CREATE TABLE `disponibilidadeprofissional` (
`ID_Profissional` int(11)
,`Nome_Profissional` varchar(100)
,`Hora` time
,`Dati` date
,`Status` varchar(7)
);

-- --------------------------------------------------------

--
-- Estrutura para tabela `profissional`
--

CREATE TABLE `profissional` (
  `ID` int(11) NOT NULL,
  `ID_U` int(11) DEFAULT NULL,
  `Adm` tinyint(1) DEFAULT NULL,
  `SenhaAdm` char(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `profissional`
--

INSERT INTO `profissional` (`ID`, `ID_U`, `Adm`, `SenhaAdm`) VALUES
(1, 2, 1, '654321'),
(2, 3, 0, NULL),
(3, 4, 0, NULL),
(4, 1, 0, NULL),
(7, 5, 0, NULL),
(45, 78, 1, NULL),
(49, 83, 0, NULL),
(50, 84, 0, NULL),
(51, 85, 0, NULL),
(52, 86, 0, NULL),
(53, 87, 0, NULL),
(54, 88, 0, NULL),
(55, 89, 0, NULL),
(56, 90, 0, NULL),
(57, 91, 0, NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `servico`
--

CREATE TABLE `servico` (
  `ID` int(11) NOT NULL,
  `Nome_S` varchar(50) DEFAULT NULL,
  `Preco` float DEFAULT NULL,
  `Duracao` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `servico`
--

INSERT INTO `servico` (`ID`, `Nome_S`, `Preco`, `Duracao`) VALUES
(1, 'Manicure', 72, '01:30:00'),
(3, 'Tintura', 112, '01:00:00'),
(4, 'Pedicure', 72, '00:30:00'),
(5, 'Corte Masculino', 85, '02:00:00');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario`
--

CREATE TABLE `usuario` (
  `ID` int(11) NOT NULL,
  `Nome` varchar(100) NOT NULL,
  `Senha` char(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuario`
--

INSERT INTO `usuario` (`ID`, `Nome`, `Senha`) VALUES
(1, 'Zeca', '123456'),
(2, 'Mateus', '123456'),
(3, 'Tony Fígaro', '456123'),
(4, 'Goku', '613452'),
(5, 'Vegeta', '346152'),
(6, 'Kuririn', '143625'),
(7, 'Bulma', '524163'),
(8, 'Mordecai', '789654'),
(10, 'Benson', '987213'),
(11, 'Saltitão', '123456'),
(12, 'Mike Maluco', '123987'),
(13, 'Fantasmão', '123987'),
(14, 'Pai do lito', '798123'),
(15, 'carlos', '123456'),
(16, 'maria', '123456'),
(17, 'vinicius', '123456'),
(51, 'sei la', '123456'),
(71, 'Igor', '123456'),
(72, 'kaue', '123456'),
(77, 'Tela', '123456'),
(78, 'samuel', '123456'),
(83, 'Mari', '123456'),
(84, 'Mario', '123456'),
(85, 'Manu', '123456'),
(86, 'hita', '123456'),
(87, 'Marcela', '123456'),
(88, 'Carla', '123456'),
(89, 'Igor', '123456'),
(90, 'naldo', '123456'),
(91, 'belo', '123456');

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `vw_admin_dashboard`
-- (Veja abaixo para a visão atual)
--
CREATE TABLE `vw_admin_dashboard` (
`ID_Profissional` int(11)
,`Nome_Profissional` varchar(100)
,`Total_Agendamentos_Profissional` bigint(21)
,`ID_Cliente` int(11)
,`Nome_Cliente` varchar(100)
,`Email_Cliente` varchar(50)
,`Celular_Cliente` char(11)
,`Total_Agendamentos_Cliente` bigint(21)
,`ID_Servico` int(11)
,`Nome_Servico` varchar(50)
,`Preco` float
,`Duracao` time
,`ID_Agendamento` int(11)
,`Hora` time
,`Dati` date
,`Status_Agendamento` tinyint(1)
);

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `vw_agendamentos_profissional`
-- (Veja abaixo para a visão atual)
--
CREATE TABLE `vw_agendamentos_profissional` (
`ID_Profissional` int(11)
,`Nome_Profissional` varchar(100)
,`Nome_Cliente` varchar(100)
,`Nome_Servico` varchar(50)
,`Hora` time
,`Dati` date
,`Status` tinyint(1)
);

-- --------------------------------------------------------

--
-- Estrutura para view `disponibilidadeprofissional`
--
DROP TABLE IF EXISTS `disponibilidadeprofissional`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `disponibilidadeprofissional`  AS SELECT `p`.`ID` AS `ID_Profissional`, `u`.`Nome` AS `Nome_Profissional`, `a`.`Hora` AS `Hora`, `a`.`Dati` AS `Dati`, CASE WHEN `a`.`ID` is not null THEN 'Ocupado' ELSE 'Livre' END AS `Status` FROM ((`profissional` `p` left join `agenda` `a` on(`p`.`ID` = `a`.`ID_P`)) join `usuario` `u` on(`p`.`ID_U` = `u`.`ID`)) ;

-- --------------------------------------------------------

--
-- Estrutura para view `vw_admin_dashboard`
--
DROP TABLE IF EXISTS `vw_admin_dashboard`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_admin_dashboard`  AS SELECT `p`.`ID` AS `ID_Profissional`, `u_p`.`Nome` AS `Nome_Profissional`, count(`a`.`ID`) AS `Total_Agendamentos_Profissional`, `c`.`ID` AS `ID_Cliente`, `u_c`.`Nome` AS `Nome_Cliente`, `ct`.`Email` AS `Email_Cliente`, `ct`.`Celular` AS `Celular_Cliente`, count(`a_c`.`ID`) AS `Total_Agendamentos_Cliente`, `s`.`ID` AS `ID_Servico`, `s`.`Nome_S` AS `Nome_Servico`, `s`.`Preco` AS `Preco`, `s`.`Duracao` AS `Duracao`, `a`.`ID` AS `ID_Agendamento`, `a`.`Hora` AS `Hora`, `a`.`Dati` AS `Dati`, `a`.`Status` AS `Status_Agendamento` FROM (((((((`profissional` `p` join `usuario` `u_p` on(`p`.`ID_U` = `u_p`.`ID`)) left join `agenda` `a` on(`p`.`ID` = `a`.`ID_P`)) left join `cliente` `c` on(`a`.`ID_C` = `c`.`ID`)) left join `usuario` `u_c` on(`c`.`ID_U` = `u_c`.`ID`)) left join `contato` `ct` on(`u_c`.`ID` = `ct`.`ID_U`)) left join `servico` `s` on(`a`.`ID_S` = `s`.`ID`)) left join `agenda` `a_c` on(`c`.`ID` = `a_c`.`ID_C`)) GROUP BY `p`.`ID`, `c`.`ID`, `s`.`ID`, `a`.`ID` ;

-- --------------------------------------------------------

--
-- Estrutura para view `vw_agendamentos_profissional`
--
DROP TABLE IF EXISTS `vw_agendamentos_profissional`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_agendamentos_profissional`  AS SELECT `p`.`ID` AS `ID_Profissional`, `u`.`Nome` AS `Nome_Profissional`, `u_c`.`Nome` AS `Nome_Cliente`, `s`.`Nome_S` AS `Nome_Servico`, `a`.`Hora` AS `Hora`, `a`.`Dati` AS `Dati`, `a`.`Status` AS `Status` FROM (((((`profissional` `p` join `agenda` `a` on(`p`.`ID` = `a`.`ID_P`)) join `usuario` `u` on(`p`.`ID_U` = `u`.`ID`)) join `cliente` `c` on(`a`.`ID_C` = `c`.`ID`)) join `usuario` `u_c` on(`c`.`ID_U` = `u_c`.`ID`)) join `servico` `s` on(`a`.`ID_S` = `s`.`ID`)) ;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `agenda`
--
ALTER TABLE `agenda`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID_C` (`ID_C`),
  ADD KEY `ID_S` (`ID_S`),
  ADD KEY `ID_P` (`ID_P`);

--
-- Índices de tabela `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `ID_U` (`ID_U`);

--
-- Índices de tabela `contato`
--
ALTER TABLE `contato`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID_U` (`ID_U`);

--
-- Índices de tabela `profissional`
--
ALTER TABLE `profissional`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `ID_U` (`ID_U`);

--
-- Índices de tabela `servico`
--
ALTER TABLE `servico`
  ADD PRIMARY KEY (`ID`);

--
-- Índices de tabela `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `agenda`
--
ALTER TABLE `agenda`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `cliente`
--
ALTER TABLE `cliente`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de tabela `contato`
--
ALTER TABLE `contato`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT de tabela `profissional`
--
ALTER TABLE `profissional`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT de tabela `servico`
--
ALTER TABLE `servico`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `usuario`
--
ALTER TABLE `usuario`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=92;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `agenda`
--
ALTER TABLE `agenda`
  ADD CONSTRAINT `agenda_ibfk_1` FOREIGN KEY (`ID_C`) REFERENCES `cliente` (`ID`),
  ADD CONSTRAINT `agenda_ibfk_2` FOREIGN KEY (`ID_S`) REFERENCES `servico` (`ID`),
  ADD CONSTRAINT `agenda_ibfk_3` FOREIGN KEY (`ID_P`) REFERENCES `profissional` (`ID`);

--
-- Restrições para tabelas `cliente`
--
ALTER TABLE `cliente`
  ADD CONSTRAINT `cliente_ibfk_1` FOREIGN KEY (`ID_U`) REFERENCES `usuario` (`ID`);

--
-- Restrições para tabelas `contato`
--
ALTER TABLE `contato`
  ADD CONSTRAINT `contato_ibfk_1` FOREIGN KEY (`ID_U`) REFERENCES `usuario` (`ID`);

--
-- Restrições para tabelas `profissional`
--
ALTER TABLE `profissional`
  ADD CONSTRAINT `profissional_ibfk_1` FOREIGN KEY (`ID_U`) REFERENCES `usuario` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
