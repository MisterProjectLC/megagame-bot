ALTER TABLE logs
ADD COLUMN sucesso boolean DEFAULT true NOT NULL;

CREATE TABLE grupos (
	nome varchar(50) PRIMARY KEY
);

CREATE TABLE nações (
	lealdade int DEFAULT 19 NOT NULL,
	nome varchar(50),
	aéreas int DEFAULT 0 NOT NULL,
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

CREATE TABLE territórios (
	nome varchar(3) PRIMARY KEY,
	isTerrestre bool DEFAULT true NOT NULL
);


CREATE TABLE frotas (
	território varchar(3),
	nação varchar(50),
	tamanho int,
	PRIMARY KEY (território, nação)
)

CREATE OR REPLACE FUNCTION fleet_destruction() RETURNS trigger AS $$
BEGIN
	IF (NEW.tamanho <= 0) THEN
		DELETE FROM frotas WHERE frotas.território = NEW.território AND frotas.nação = NEW.nação;
	END IF;
	RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER detect_fleet_destruction AFTER UPDATE ON frotas
	FOR EACH ROW
	EXECUTE PROCEDURE fleet_destruction();


CREATE OR REPLACE FUNCTION fleet_merge() RETURNS trigger AS $$
BEGIN
	IF (EXISTS (SELECT * FROM frotas WHERE frotas.território = NEW.território AND frotas.nação = NEW.nação)) THEN
		UPDATE frotas SET tamanho = tamanho + NEW.tamanho
		WHERE frotas.território = NEW.território AND frotas.nação = NEW.nação;
	END IF;
	RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER detect_fleet_merge BEFORE INSERT ON frotas
	FOR EACH ROW
	EXECUTE PROCEDURE fleet_merge();


CREATE TABLE terrestres (
	nome varchar(3),
	recurso varchar(1),
	tropas int check(tropas >= 0),
	nação varchar(50),
	influência1 varchar(50),
	influência2 varchar(50),
	poluição bool,
	FOREIGN KEY (nome) references territórios(nome),
	FOREIGN KEY (nação) references nações(nome),
	FOREIGN KEY (influência1) references grupos(nome),
	FOREIGN KEY (influência2) references grupos(nome)
);


CREATE TABLE adjacentes (
	terA varchar(3),
	terB varchar(3) CHECK (terA != terB)
);

CREATE OR REPLACE FUNCTION reciprocate_adjacent() RETURNS trigger AS $$
BEGIN
	IF (NOT EXISTS (SELECT * FROM adjacentes WHERE terA = new.terB AND terB = new.terA)) THEN
		INSERT INTO adjacentes VALUES (new.terB, new.terA);
	END IF;
	RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_adjacent_insert AFTER INSERT ON adjacentes
	FOR EACH ROW
	EXECUTE PROCEDURE reciprocate_adjacent();


CREATE TABLE movimentos (
	origem varchar(3),
	destino varchar(3),
	forças int,
	PRIMARY KEY (origem, destino),
	FOREIGN KEY (origem) references territórios(nome),
	FOREIGN KEY (destino) references territórios(nome)
)