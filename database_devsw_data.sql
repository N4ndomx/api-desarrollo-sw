--
-- PostgreSQL database dump
--

-- Dumped from database version 11.16 (Debian 11.16-1.pgdg90+1)
-- Dumped by pg_dump version 11.16 (Debian 11.16-1.pgdg90+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: cuenta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cuenta (id_cuenta, titular, fecha_apert, estado) FROM stdin;
\.


--
-- Data for Name: producto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.producto (id_producto, nombre, descripcion, "SKU", precio, create_at, modified_at, estado) FROM stdin;
f0cd9953-b7ff-4bde-a16f-e91527794191	Gafas de Sol	Protección UV400, color negro	1234567890	$35.50	2024-06-14 01:09:14.945344	2024-06-14 01:09:14.945344	ACTIVO
00feb13d-ff26-4ef5-b88f-16a726634486	Auriculares Inalámbricos	Bluetooth 5.0, color blanco	0987654321	$49.99	2024-06-14 01:09:24.629646	2024-06-14 01:09:24.629646	ACTIVO
113f8bf1-60e0-47c1-ae3a-f9160ebe01df	Botella de Agua	Acero inoxidable, 1 litro	1122334455	$25.00	2024-06-14 01:09:36.159714	2024-06-14 01:09:36.159714	ACTIVO
47ab950d-3c47-4c94-99d0-46178af0cdeb	Cargador Rápido USB-C	20W, compatible con múltiples dispositivos	6677889900	$15.75	2024-06-14 01:09:44.870591	2024-06-14 01:09:44.870591	ACTIVO
bed5e2a7-5cd1-4f7f-b6eb-28b13e25f468	Mochila Deportiva	Impermeable, 30L, color azul	3344556677	$40.00	2024-06-14 01:09:53.870906	2024-06-14 01:09:53.870906	ACTIVO
6ac8402f-7c18-4101-b844-a772f2d604d0	Smartwatch	Monitor de actividad, color negro	4433221100	$89.99	2024-06-14 01:10:03.65299	2024-06-14 01:10:03.65299	ACTIVO
af330f3f-d21f-4374-85d5-f112d8475b80	Ratón Inalámbrico	Ergonómico, recargable	5566778899	$29.99	2024-06-14 01:10:16.868155	2024-06-14 01:10:16.868155	ACTIVO
3a587c81-9c8c-44b2-9d30-9ffba15adba8	Torta de Queso	Deliciosa torta hecha con queso fresco	TORTAD-391	$9.99	2024-06-14 01:13:49.396664	2024-06-14 01:13:49.396664	ACTIVO
6d6d448e-82a2-47d3-82bc-56b3131b160e	Arroz con Leche	Postre tradicional con arroz y leche	ARROZC-956	$14.50	2024-06-14 01:15:37.957467	2024-06-14 01:15:37.957467	ACTIVO
68a0a8ab-f677-4d7c-a72f-4e13425787eb	Ensalada de Manzana	Ensalada fresca con manzanas	ENSALA-545	$6.00	2024-06-14 01:16:31.546921	2024-06-14 01:16:31.546921	ACTIVO
accce6bc-950b-491a-a3a4-523af2a62ff7	Chocomilk	leche con chocholate	CHOCOM-375	$26.00	2024-06-14 01:18:47.376624	2024-06-14 01:18:47.376624	ACTIVO
\.


--
-- Data for Name: cuenta_producto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cuenta_producto (id_cuenta_prod, cantidad, fecha_registro, "cuentaIdCuenta", "productIdProducto") FROM stdin;
\.


--
-- Data for Name: ingrediente; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ingrediente (id_ingrediente, nombre, unidad_medida, estado, stock, stock_min, create_at, modified_at) FROM stdin;
f1de1e9d-3864-49b9-9b67-4400227137cf	Pan	UNIDAD	ACTIVO	500	50	2024-06-14 01:06:10.84702	2024-06-14 01:06:10.84702
5e76f090-5f58-4f27-9878-959666d4ecd5	Leche	LITROS	ACTIVO	200	30	2024-06-14 01:06:30.425648	2024-06-14 01:06:30.425648
10bd0aa9-8de0-4308-9e1c-8ad7c858188f	Arroz	KILOGRAMOS	ACTIVO	300	40	2024-06-14 01:06:51.899099	2024-06-14 01:06:51.899099
5f972651-66e9-4583-96a4-23e92025c2af	Huevos	UNIDAD	ACTIVO	1000	100	2024-06-14 01:07:02.730285	2024-06-14 01:07:02.730285
43f501ad-18cb-4d49-a32c-4e02d0082d91	Manzanas	KILOGRAMOS	ACTIVO	150	20	2024-06-14 01:07:30.489881	2024-06-14 01:07:30.489881
3425ebad-4366-4105-b693-477ed844ee44	Esensia de Chocolate	MILILITROS	ACTIVO	1000	20	2024-06-14 01:08:17.555433	2024-06-14 01:08:17.555433
796fc693-1595-480b-b156-8b655b0421b2	Queso	GRAMOS	ACTIVO	50	20	2024-06-14 01:12:44.573922	2024-06-14 01:12:44.573922
\.


--
-- Data for Name: producto_ingrediente; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.producto_ingrediente (id, cantidad, id_producto, id_ingrediente) FROM stdin;
1c6ebed2-1561-4e21-943d-802b28083f65	10	3a587c81-9c8c-44b2-9d30-9ffba15adba8	796fc693-1595-480b-b156-8b655b0421b2
d9f0acd0-e698-491f-9799-05cff69aa875	2	3a587c81-9c8c-44b2-9d30-9ffba15adba8	f1de1e9d-3864-49b9-9b67-4400227137cf
eecd223f-8c66-47df-9dac-de8b2c9369be	2	6d6d448e-82a2-47d3-82bc-56b3131b160e	5e76f090-5f58-4f27-9878-959666d4ecd5
8d84fe92-469c-4911-8220-ec96bfe1c1e9	1	6d6d448e-82a2-47d3-82bc-56b3131b160e	10bd0aa9-8de0-4308-9e1c-8ad7c858188f
1d7cb182-d04c-4d48-af51-3313b238d5cc	3	68a0a8ab-f677-4d7c-a72f-4e13425787eb	43f501ad-18cb-4d49-a32c-4e02d0082d91
69ebecf9-80dd-450b-b2ef-c28559694ab0	1	accce6bc-950b-491a-a3a4-523af2a62ff7	5e76f090-5f58-4f27-9878-959666d4ecd5
ce023753-ed02-4732-aad3-f7fe7f4dceae	5	accce6bc-950b-491a-a3a4-523af2a62ff7	3425ebad-4366-4105-b693-477ed844ee44
\.


--
-- Data for Name: producto_inventario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.producto_inventario (id_producto_inventario, stock, stock_min, modified_inven, "productoIdProducto") FROM stdin;
4c61825b-98b5-4fca-9a83-bea1e1aa136a	50	0	2024-06-14 01:09:15.008527	f0cd9953-b7ff-4bde-a16f-e91527794191
8b2bed46-9aa4-474c-8a3c-95e7804ee5e3	200	0	2024-06-14 01:09:24.683813	00feb13d-ff26-4ef5-b88f-16a726634486
8fe1ae47-1587-49ba-85f1-28d46b02ee35	150	0	2024-06-14 01:09:36.208946	113f8bf1-60e0-47c1-ae3a-f9160ebe01df
12ba04bf-d828-48d3-af75-fe907595db12	120	0	2024-06-14 01:09:44.92339	47ab950d-3c47-4c94-99d0-46178af0cdeb
fda48e46-f5ea-4b0e-a824-d0524562b94b	75	0	2024-06-14 01:09:53.922974	bed5e2a7-5cd1-4f7f-b6eb-28b13e25f468
7b4fe5d1-d396-4934-95ad-1444d5667feb	60	0	2024-06-14 01:10:03.713354	6ac8402f-7c18-4101-b844-a772f2d604d0
faf1f174-e094-4277-b38b-4beb76011cff	95	0	2024-06-14 01:10:16.918772	af330f3f-d21f-4374-85d5-f112d8475b80
\.


--
-- Data for Name: rol; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rol (id_rol, nombre) FROM stdin;
1	admin
2	ayudante
\.


--
-- Data for Name: servicio; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.servicio (id_service, nombre, descripcion) FROM stdin;
03cd1bbc-9d15-4afe-b114-e18643b6229c	Acceso a Internet	Acceso a internet de alta velocidad
31bce554-6f0d-498d-ba56-57efce191d71	Impresión de Documentos COLOR	Servicio de impresión  a color
a915c222-f2f5-4bc9-bcbe-75dedbfca693	Renta de Mesa de Billar	Disfruta de una partida de billar con tus amigos
\.


--
-- Data for Name: tarifa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tarifa (id_tarifa, precio_base, unidad_facturacion, "servicioIdService") FROM stdin;
e057338e-4e38-4775-ad66-c72fa416bd5b	$2.00	HORA	03cd1bbc-9d15-4afe-b114-e18643b6229c
d809aaa7-26ed-4a27-b2d5-34e76c3dfb8c	$15.00	DIA	03cd1bbc-9d15-4afe-b114-e18643b6229c
c2cf4b96-a08a-4c20-ae08-f78f14b0c788	$0.10	UNIDAD	31bce554-6f0d-498d-ba56-57efce191d71
cf1fea43-5014-4156-a6a0-7362ce5ef065	$30.00	HORA	a915c222-f2f5-4bc9-bcbe-75dedbfca693
43ac7bb1-5df3-444c-b846-cf484c40a04d	$15.00	FRACCION	a915c222-f2f5-4bc9-bcbe-75dedbfca693
\.


--
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario (id_usuario, nombres, apellidos, direccion, genero, telefono, email, password, "idRolIdRol") FROM stdin;
\.


--
-- Name: rol_id_rol_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rol_id_rol_seq', 2, true);


--
-- PostgreSQL database dump complete
--

