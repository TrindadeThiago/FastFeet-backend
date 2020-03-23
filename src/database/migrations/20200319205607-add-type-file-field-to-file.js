module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('files', 'file_type_id', {
      type: Sequelize.INTEGER,
      references: { model: 'file_type', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: false,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('files', 'file_type_id');
  },
};
