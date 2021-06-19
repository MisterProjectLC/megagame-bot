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

ALTER TABLE logs
add constraint jogador
   foreign key (jogador)
   references jogadores(jogador_id)
   on delete cascade;
   
SELECT * FROM logs