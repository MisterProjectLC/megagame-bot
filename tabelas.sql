ALTER TABLE logs
ADD COLUMN sucesso boolean DEFAULT true NOT NULL;

CREATE DOMAIN receita_domain AS text
CHECK (VALUE IN ('Imposto', 'Influência', 'Corporação'));

CREATE TABLE grupos (
	nome varchar(50) PRIMARY KEY,
	tesoureiro text,
	receita text NOT NULL DEFAULT "Imposto",
	ruínas int NOT NULL DEFAULT 0,
	commodities int NOT NULL DEFAULT 0,
	FOREIGN KEY (tesoureiro) REFERENCES jogadores(username)
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

CREATE TABLE jogadores (
	jogador_id text PRIMARY KEY,
	username text,
	recursos int CHECK (recursos >= 0),
	time_nome varchar(50),
	cargo varchar(50),
	canal varchar(100)
	FOREIGN KEY (time_nome) REFERENCES grupos(nome)
)

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

CREATE OR REPLACE FUNCTION nagamitsu_opinion() RETURNS trigger AS $$
BEGIN
	IF NEW.objeto = 'Nagamitsu' THEN
		UPDATE opiniões SET valor = valor + (NEW.valor - OLD.valor) 
		WHERE sujeito = NEW.sujeito AND objeto = 'Naga';
		UPDATE opiniões SET valor = valor + (NEW.valor - OLD.valor) 
		WHERE sujeito = NEW.sujeito AND objeto = 'Mitsu';
	END IF;
	RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_nagamitsu_opinion AFTER UPDATE ON opiniões
	FOR EACH ROW
	EXECUTE PROCEDURE nagamitsu_opinion();

CREATE TABLE tratados_fronteiras (
	nação1 varchar(50),
	nação2 varchar(50),
	PRIMARY KEY (nação1, nação2),
	FOREIGN KEY (nação1) REFERENCES nações(nome),
	FOREIGN KEY (nação2) REFERENCES nações(nome)
);

CREATE OR REPLACE FUNCTION reciprocate_treaties() RETURNS trigger AS $$
BEGIN
	IF (NOT EXISTS (SELECT * FROM tratados_fronteiras WHERE nação1 = new.nação2 AND nação2 = new.nação1)) THEN
		INSERT INTO tratados_fronteiras VALUES (new.nação2, new.nação1);
	END IF;
	RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_treaties_insert AFTER INSERT ON tratados_fronteiras
	FOR EACH ROW
	EXECUTE PROCEDURE reciprocate_treaties();

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
		RETURN NULL;
	END IF;
	RETURN NEW;
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


CREATE OR REPLACE FUNCTION movements_merge() RETURNS trigger AS $$
BEGIN
	IF (EXISTS (SELECT * FROM movimentos WHERE movimentos.destino = NEW.destino AND movimentos.nação = NEW.nação)) THEN
		UPDATE movimentos SET forças = forças + NEW.forças
		WHERE movimentos.destino = NEW.destino AND movimentos.nação = NEW.nação;
		RETURN NULL;
	END IF;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER detect_movements_merge BEFORE INSERT ON movimentos
	FOR EACH ROW
	EXECUTE PROCEDURE movements_merge();


CREATE FUNCTION isHostil(naçãoAtacante varchar(50), territórioAlvo varchar(3)) RETURNS bool AS $$
BEGIN
    RETURN (EXISTS (SELECT * FROM frotas AS nativas WHERE nativas.nação <> naçãoAtacante AND
		nativas.território = territórioAlvo AND
		NOT EXISTS (SELECT * FROM tratados_fronteiras WHERE nação1 = naçãoAtacante AND nação2 = nativas.nação))
	OR 
		EXISTS (SELECT * FROM movimentos AS nativos WHERE nativos.nação <> naçãoAtacante AND
		nativos.destino = territórioAlvo AND
		NOT EXISTS (SELECT * FROM tratados_fronteiras WHERE nação1 = naçãoAtacante AND nação2 = nativos.nação))
	);
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION meuTerritório(naçãoDona varchar(50), territórioAlvo varchar(3)) RETURNS bool AS $$
BEGIN
    RETURN EXISTS (SELECT nome FROM territórios WHERE nome = territórioAlvo AND
    (
		(isterrestre = true AND EXISTS (SELECT nome FROM terrestres WHERE nome = territórioAlvo AND nação = naçãoDona)) OR
        (isterrestre = false AND EXISTS (
			SELECT tera from adjacentes WHERE tera = territórioAlvo AND EXISTS 
			(SELECT nome FROM terrestres WHERE nome = terb AND nação = naçãoDona) AND
				NOT EXISTS (
					SELECT nação FROM frotas WHERE frotas.nação <> naçãoDona AND frotas.território = territórioAlvo AND
					NOT EXISTS (SELECT nação1 FROM tratados_fronteiras WHERE nação1 = naçãoDona AND nação2 = frotas.nação)
				)
			)
		)
	));
END;
$$ LANGUAGE plpgsql;