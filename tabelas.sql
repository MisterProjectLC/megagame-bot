ALTER TABLE logs
ADD COLUMN sucesso boolean DEFAULT true NOT NULL;

CREATE TABLE grupos (
	nome varchar(50) PRIMARY KEY
);

CREATE TABLE nações (
	lealdade int DEFAULT 19 NOT NULL,
	nome varchar(50),
	FOREIGN KEY (nome) REFERENCES grupos(nome)
);

CREATE TABLE facções (
	nome varchar(50),
	FOREIGN KEY (nome) REFERENCES grupos(nome)
);

CREATE TABLE jogadoresGrupos (
	jogador text,
	grupo varchar(50),
	PRIMARY KEY (jogador, grupo),
	FOREIGN KEY (jogador) REFERENCES jogadores(jogador_id),
	FOREIGN KEY (grupo) REFERENCES grupos(nome)
);

CREATE TABLE opiniões (
	sujeito varchar(50),
	objeto varchar(50),
	valor int DEFAULT 0 NOT NULL,
	PRIMARY KEY (sujeito, objeto),
	FOREIGN KEY (sujeito) REFERENCES grupos(nome),
	FOREIGN KEY (objeto) REFERENCES grupos(nome)
);

CREATE TABLE pesquisas (
	nome varchar(50),
	descrição varchar(500),
	grupo varchar(50),
	PRIMARY KEY (nome, grupo),
	FOREIGN KEY (grupo) REFERENCES grupos(nome)
);

CREATE TABLE logs (
	jogador text,
	comando varchar(600),
	idade int,
	sucesso bool,
	nome varchar(30),
	prioridade int,
	args varchar(300),
	custo int
	PRIMARY KEY (jogador, idade)
	FOREIGN KEY (jogador) REFERENCES jogadores.jogador_id
);