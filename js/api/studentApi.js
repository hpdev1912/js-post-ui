import axiosClient from './axiosClient';

const studentsApi = {
  getAll(params) {
    const url = '/students';
    return axiosClient.get(url, {
      params,
    });
  },

  getById(id) {
    const url = `/students/${id}`;
    return axiosClient.get(url);
  },

  add(postData) {
    const url = '/students';
    return axiosClient.post(url, postData);
  },

  update(postData) {
    const url = `/students/${postData.id}`;
    return axiosClient.patch(url, postData);
  },

  remove(id) {
    const url = `/students/${id}`;

    return axiosClient.delete(url);
  },
};

export default studentsApi;
