import axios from 'axios';
import { environments } from 'src/config/environments';
import { ILevelInstance } from 'src/models/levelInstance';

export const getLevelsPerInstance = async (instance: string) => {
  try {
    const { data } = await axios.get(
      `${environments.VOLDEMORT_API}/lxp/levels/${instance}`,
      {
        headers: {
          Authorization: `Bearer ${environments.TOKEN_VOLDEMORT}`,
        },
      },
    );
    return data.data as ILevelInstance[];
  } catch (err) {
    console.log({ err });
  }
};
