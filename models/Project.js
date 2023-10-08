module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define("project", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    });
    Project.associate = function (models) {
        Project.hasMany(models.task);
        Project.belongsTo(models.user);
    };
    return Project;
};