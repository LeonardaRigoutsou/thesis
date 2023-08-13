const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://rykrhuky:5OVYPkBqUxPjTWoWfLa6Kk4pmVgediTi@tyke.db.elephantsql.com/rykrhuky', {
    pool: {
        max: 5,
        min: 1
    },
});

const Category = sequelize.define('categories', {
    categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    qualifierType: {
        type: Sequelize.STRING,
        allowNull: true
    },
    isAvailable: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
}, { "timestamps": false });

const Order = sequelize.define('orders', {
    orderId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        unique: true
    },
    serverId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    tableNum: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    orderDate: {
        type: Sequelize.DATE,
        allowNull: false
    },
    orderTotal: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    state: {
        type: Sequelize.STRING,
        allowNull: false
    },
    instructions: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, { "timestamps": false });

const Item = sequelize.define('items', {
    itemId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    price: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    isAvailable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    ingredients: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, { "timestamps": false });

const OrderItem = sequelize.define('orderitems', {
    status: {
        type: Sequelize.STRING,
        allowNull: false
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    qualifiers: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, { "timestamps": false });

const Reservation = sequelize.define('reservations', {
    reservationId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        unique: true
    },
    reservationName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    reservationDate: {
        type: Sequelize.DATE,
        allowNull: false
    }
}, { "timestamps": false });

const Table = sequelize.define('tables', {
    tableNum: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true
    },
    seats: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    locationX: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    locationY: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, { "timestamps": false });

const User = sequelize.define('users', {
    userId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        unique: true
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    hireDate: {
        type: Sequelize.DATE,
        allowNull: false
    },
    role: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, { "timestamps": false });

//Describing associations with foreign keys
User.hasOne(Order, {
    foreignKey: "serverId"
});

Order.belongsTo(Table, {
    foreignKey: "tableNum"
});

Reservation.belongsTo(Table, {
    foreignKey: "tableNum"
});

Order.belongsToMany(Item, {
    through: OrderItem,
    foreignKey: 'orderId'
});
Item.belongsToMany(Order, {
    through: OrderItem,
    foreignKey: 'itemId'
});

Item.belongsTo(Category, {
    foreignKey: "categoryId"
});

const states = {
    new: "NEW",
    open: "OPEN",
    cancelled: "CANCELLED",
    made: "MADE",
    closed: "CLOSED"
};

const roles = {
    admin: "admin",
    server: "server",
    cooker: "cooker"
};

const qualifierTypes = {
    coffee: "coffee",
    drink: "drink"
};


exports.Category = Category;
exports.Order = Order;
exports.Item = Item;
exports.OrderItem = OrderItem;
exports.Table = Table;
exports.User = User;
exports.Reservation = Reservation;

exports.states = states;
exports.roles = roles;

exports.sequelize = sequelize;