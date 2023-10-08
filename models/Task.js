module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define("task", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('completed', 'incomplete'),
            allowNull: false,
            defaultValue: 'incomplete',
        },
        priority: {
            type: DataTypes.ENUM('high', 'medium', 'low'),
            allowNull: false,
            defaultValue: 'medium',
        }
    });
    Task.associate = function (models) {
        Task.belongsTo(models.project);
        Task.belongsTo(models.user);
    };
    return Task;
};