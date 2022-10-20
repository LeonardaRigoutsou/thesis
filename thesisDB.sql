CREATE TABLE IF NOT EXISTS categories (
	category_id INT NOT NULL,
	PRIMARY KEY (category_id),
	name varchar (20) NOT NULL,
	is_available boolean NOT NULL
);

CREATE TABLE IF NOT EXISTS items (
	item_id INT NOT NULL,
	PRIMARY KEY (item_id),
	category_id INT NOT NULL,
	FOREIGN KEY (category_id) REFERENCES categories (category_id),
	title varchar (20) NOT NULL,
	price INT NOT NULL,
	is_available boolean NOT NULL,
	ingredients varchar(500)
);

CREATE TABLE IF NOT EXISTS tables (
	table_num INT NOT NULL,
	PRIMARY KEY (table_num),
	seats INT,
	location_x INT NOT NULL,
	location_y INT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
	user_id INT NOT NULL, 
	PRIMARY KEY (user_id),
	username varchar (20) NOT NULL,
	password varchar (100) NOT NULL,
	first_name varchar (20) NOT NULL,
	last_name varchar (20) NOT NULL,
	hire_date date NOT NULL,
	role varchar(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
	order_id INT NOT NULL,
	PRIMARY KEY (order_id),
	server_id INT NOT NULL,
	FOREIGN KEY (server_id) REFERENCES users (user_id),
	table_num INT NOT NULL,
	FOREIGN KEY(table_num) REFERENCES tables (table_num),
	order_date TIMESTAMP NOT NULL,
	state varchar(15) NOT NULL,
	instructions varchar(500)
);

CREATE TABLE IF NOT EXISTS orderItems (
	order_id INT NOT NULL,
	FOREIGN KEY (order_id) REFERENCES orders (order_id),
	item_id INT NOT NULL,
	FOREIGN KEY (item_id) REFERENCES items (item_id),
	status varchar (20) NOT NULL,
	quantity int not null,
	qualifiers varchar(500) 
);