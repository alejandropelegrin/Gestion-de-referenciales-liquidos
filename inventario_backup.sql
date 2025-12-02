--
-- PostgreSQL database dump
--

\restrict zC3nbHcK4WEx4ILfSckhxD69PWLJq6jew0vapugflzcEnF6yPvt3jsicVbxHdDm

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: liquidos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.liquidos (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    ubicacion character varying(100),
    fecha_intro date,
    fecha_cad date,
    orr character varying(50),
    fecha_reg date,
    cerrado boolean DEFAULT false,
    fecha_cierre timestamp without time zone
);


ALTER TABLE public.liquidos OWNER TO postgres;

--
-- Name: liquidos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.liquidos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.liquidos_id_seq OWNER TO postgres;

--
-- Name: liquidos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.liquidos_id_seq OWNED BY public.liquidos.id;


--
-- Name: referenciales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.referenciales (
    id integer NOT NULL,
    cq character varying(50) NOT NULL,
    ubicacion character varying(100),
    fecha_intro date,
    fecha_cad date,
    cerrado boolean DEFAULT false,
    fecha_cierre timestamp without time zone
);


ALTER TABLE public.referenciales OWNER TO postgres;

--
-- Name: referenciales_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.referenciales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.referenciales_id_seq OWNER TO postgres;

--
-- Name: referenciales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.referenciales_id_seq OWNED BY public.referenciales.id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password text NOT NULL
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: liquidos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liquidos ALTER COLUMN id SET DEFAULT nextval('public.liquidos_id_seq'::regclass);


--
-- Name: referenciales id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.referenciales ALTER COLUMN id SET DEFAULT nextval('public.referenciales_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Data for Name: liquidos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.liquidos (id, nombre, ubicacion, fecha_intro, fecha_cad, orr, fecha_reg, cerrado, fecha_cierre) FROM stdin;
22	Líquido 9	Maquina 1, Maquina 2	2025-09-30	2025-10-24	M7	2025-10-31	f	\N
16	Líquido 6	Maquina 2	2025-09-04	2025-12-19	M3	2025-09-04	f	2025-10-08 12:47:58.853116
3	Líquido 3	Maquina 1	2025-08-25	2025-12-26	M2	2025-09-05	f	\N
\.


--
-- Data for Name: referenciales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.referenciales (id, cq, ubicacion, fecha_intro, fecha_cad, cerrado, fecha_cierre) FROM stdin;
5	76.1	Maquina 4	2025-09-10	2025-12-04	f	\N
2	67.1	Maquina 2	2025-09-10	2026-01-15	f	\N
1	55.6	Maquina 3	2025-09-01	2025-12-01	f	\N
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, username, password) FROM stdin;
1	admin	$2b$10$xGTjkhBMdKbdmh7doXoNB.LnaeTyXECGfvV6pj9IDEIT.ybS9Lpjy
4	user	$2b$10$GKeLki7EtDBodjmJdWSfS.nczG/CdO19M0Gttvp6Bm4hLNlmADQIi
\.


--
-- Name: liquidos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.liquidos_id_seq', 23, true);


--
-- Name: referenciales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.referenciales_id_seq', 24, true);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 4, true);


--
-- Name: liquidos liquidos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liquidos
    ADD CONSTRAINT liquidos_pkey PRIMARY KEY (id);


--
-- Name: referenciales referenciales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.referenciales
    ADD CONSTRAINT referenciales_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_username_key UNIQUE (username);


--
-- PostgreSQL database dump complete
--

\unrestrict zC3nbHcK4WEx4ILfSckhxD69PWLJq6jew0vapugflzcEnF6yPvt3jsicVbxHdDm

