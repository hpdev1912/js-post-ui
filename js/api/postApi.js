import axiosClient from './axiosClient';

const postApi = {
  getAll(params) {
    const url = '/posts';
    return axiosClient.get(url, {
      params,
    });
  },

  getById(id) {
    const url = `/posts/${id}`;
    return axiosClient.get(url);
  },

  add(postData) {
    const url = '/posts';
    return axiosClient.post(url, postData);
  },

  update(postData) {
    const url = `/posts/${postData.id}`;
    return axiosClient.patch(url, postData);
  },

  addFormData(postData) {
    const url = '/with-thumbnail/posts';
    return axiosClient.post(url, postData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  updateFormData(postData) {
    const url = `/with-thumbnail/posts/${postData.get('id')}`;
    return axiosClient.patch(url, postData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  remove(id) {
    const url = `/posts/${id}`;

    return axiosClient.delete(url);
  },
};

export default postApi;
