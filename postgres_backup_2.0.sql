PGDMP     !                    {            flower_project    15.1    15.1     )           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            *           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            +           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            ,           1262    16400    flower_project    DATABASE     �   CREATE DATABASE flower_project WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Russian_Russia.1251';
    DROP DATABASE flower_project;
                postgres    false            �            1259    16429    orders_id_seq    SEQUENCE     �   CREATE SEQUENCE public.orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1
    CYCLE;
 $   DROP SEQUENCE public.orders_id_seq;
       public          postgres    false            �            1259    16479 
   categories    TABLE     �   CREATE TABLE public.categories (
    id integer DEFAULT nextval('public.orders_id_seq'::regclass) NOT NULL,
    name text NOT NULL,
    image text
);
    DROP TABLE public.categories;
       public         heap    postgres    false    214            �            1259    16488    items    TABLE     �  CREATE TABLE public.items (
    id integer DEFAULT nextval('public.orders_id_seq'::regclass) NOT NULL,
    name text NOT NULL,
    category_id integer NOT NULL,
    price numeric(15,2) NOT NULL,
    count integer NOT NULL,
    description text,
    image text,
    CONSTRAINT "item counts must be non-negative" CHECK ((count >= 0)),
    CONSTRAINT "item prices must be non-negative" CHECK ((price >= (0)::numeric))
);
    DROP TABLE public.items;
       public         heap    postgres    false    214            �            1259    16430    orders    TABLE     3  CREATE TABLE public.orders (
    id integer DEFAULT nextval('public.orders_id_seq'::regclass) NOT NULL,
    date_and_time timestamp with time zone DEFAULT LOCALTIMESTAMP NOT NULL,
    client_id integer NOT NULL,
    shopping_cart text NOT NULL,
    price numeric(15,2) NOT NULL,
    status text NOT NULL
);
    DROP TABLE public.orders;
       public         heap    postgres    false    214            �            1259    24719    tokens    TABLE     Q   CREATE TABLE public.tokens (
    email text NOT NULL,
    token text NOT NULL
);
    DROP TABLE public.tokens;
       public         heap    postgres    false            �            1259    24709    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1
    CYCLE;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false            �            1259    16498    users    TABLE     S  CREATE TABLE public.users (
    id integer DEFAULT nextval('public.users_id_seq'::regclass) NOT NULL,
    first_name text NOT NULL,
    last_name text,
    email text NOT NULL,
    phone_number text NOT NULL,
    password text NOT NULL,
    role text NOT NULL,
    email_confirmed boolean DEFAULT false NOT NULL,
    shopping_cart text
);
    DROP TABLE public.users;
       public         heap    postgres    false    219            "          0    16479 
   categories 
   TABLE DATA           5   COPY public.categories (id, name, image) FROM stdin;
    public          postgres    false    216   4%       #          0    16488    items 
   TABLE DATA           X   COPY public.items (id, name, category_id, price, count, description, image) FROM stdin;
    public          postgres    false    217   ]%       !          0    16430    orders 
   TABLE DATA           \   COPY public.orders (id, date_and_time, client_id, shopping_cart, price, status) FROM stdin;
    public          postgres    false    215   �%       &          0    24719    tokens 
   TABLE DATA           .   COPY public.tokens (email, token) FROM stdin;
    public          postgres    false    220   &       $          0    16498    users 
   TABLE DATA              COPY public.users (id, first_name, last_name, email, phone_number, password, role, email_confirmed, shopping_cart) FROM stdin;
    public          postgres    false    218   N&       -           0    0    orders_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.orders_id_seq', 12, true);
          public          postgres    false    214            .           0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 6, true);
          public          postgres    false    219            �           2606    16486 &   categories category ids must be unique 
   CONSTRAINT     f   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "category ids must be unique" PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.categories DROP CONSTRAINT "category ids must be unique";
       public            postgres    false    216            �           2606    16511 $   users email addresses must be unique 
   CONSTRAINT     b   ALTER TABLE ONLY public.users
    ADD CONSTRAINT "email addresses must be unique" UNIQUE (email);
 P   ALTER TABLE ONLY public.users DROP CONSTRAINT "email addresses must be unique";
       public            postgres    false    218            �           2606    24737 "   tokens email tokens must be unique 
   CONSTRAINT     `   ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT "email tokens must be unique" UNIQUE (token);
 N   ALTER TABLE ONLY public.tokens DROP CONSTRAINT "email tokens must be unique";
       public            postgres    false    220            �           2606    16497    items item ids must be unique 
   CONSTRAINT     ]   ALTER TABLE ONLY public.items
    ADD CONSTRAINT "item ids must be unique" PRIMARY KEY (id);
 I   ALTER TABLE ONLY public.items DROP CONSTRAINT "item ids must be unique";
       public            postgres    false    217            �           2606    16463    orders order ids must be unique 
   CONSTRAINT     _   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "order ids must be unique" PRIMARY KEY (id);
 K   ALTER TABLE ONLY public.orders DROP CONSTRAINT "order ids must be unique";
       public            postgres    false    215            |           2606    16514 (   orders order prices must be non-negative    CHECK CONSTRAINT     |   ALTER TABLE public.orders
    ADD CONSTRAINT "order prices must be non-negative" CHECK ((price >= (0)::numeric)) NOT VALID;
 O   ALTER TABLE public.orders DROP CONSTRAINT "order prices must be non-negative";
       public          postgres    false    215    215            �           2606    16513 "   users phone numbers must be unique 
   CONSTRAINT     g   ALTER TABLE ONLY public.users
    ADD CONSTRAINT "phone numbers must be unique" UNIQUE (phone_number);
 N   ALTER TABLE ONLY public.users DROP CONSTRAINT "phone numbers must be unique";
       public            postgres    false    218            �           2606    24725    tokens token ids must be unique 
   CONSTRAINT     b   ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT "token ids must be unique" PRIMARY KEY (email);
 K   ALTER TABLE ONLY public.tokens DROP CONSTRAINT "token ids must be unique";
       public            postgres    false    220            �           2606    16505    users user ids must be unique 
   CONSTRAINT     ]   ALTER TABLE ONLY public.users
    ADD CONSTRAINT "user ids must be unique" PRIMARY KEY (id);
 I   ALTER TABLE ONLY public.users DROP CONSTRAINT "user ids must be unique";
       public            postgres    false    218            �           2606    16520    items category id cascade    FK CONSTRAINT     �   ALTER TABLE ONLY public.items
    ADD CONSTRAINT "category id cascade" FOREIGN KEY (category_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 E   ALTER TABLE ONLY public.items DROP CONSTRAINT "category id cascade";
       public          postgres    false    3202    217    216            �           2606    24743    orders client id cascade    FK CONSTRAINT     �   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "client id cascade" FOREIGN KEY (client_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 D   ALTER TABLE ONLY public.orders DROP CONSTRAINT "client id cascade";
       public          postgres    false    218    3210    215            �           2606    24738 '   tokens delete the old email token first    FK CONSTRAINT     �   ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT "delete the old email token first" FOREIGN KEY (email) REFERENCES public.users(email) ON UPDATE RESTRICT ON DELETE CASCADE NOT VALID;
 S   ALTER TABLE ONLY public.tokens DROP CONSTRAINT "delete the old email token first";
       public          postgres    false    3206    220    218            "      x�3�,.)��K������� ,�6      #   "   x�3�,.)��K�4�44�30�4������� S�      !   h   x�34�4202�50�50S04�20�20�3�444��60�4�V2P�2���30��K-W�/JI-�24D�jjeh�gfnihf�
���_P������XT�����  �      &   7   x�+-N-rH�H�-�I�K���L-�MK16p3�vw���я,�3uu������� ��      $   A   x�3�,.)��K�Q�ũE���9�z����چF�&�f���0E�9��y%�i�1~\1z\\\ 6JF     