import {
  setData,
  getData,
  listLocalThirds,
  listLocalMaterials,
  listLocalYards,
} from '../../helpers/localDataManagement';

export default {
  setData: (data) => setData(data),
  getData: () => getData(),
  listLocalThirds: (data) => listLocalThirds(data),
  listLocalMaterials: (data) => listLocalMaterials(data),
  listLocalYards: (data) => listLocalYards(data),
};
