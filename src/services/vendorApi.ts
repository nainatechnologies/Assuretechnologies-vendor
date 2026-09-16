import API from './api';

export const getProfile = async () => {
  const response = await API.get('/vendor/profile');
  return response.data?.data || response.data;
};

export const updateProfile = async (profileData: any) => {
  const response = await API.put('/vendor/profile', profileData);
  return response.data?.data || response.data;
};
