import api from '../../shared/api/axios';
const defaultStructure = {
    nodes: [],
    edges: []
};
export const RoadmapService = {
    async getAll() {
        const response = await api.get('/roadmaps');
        return response.data.map(roadmap => ({
            ...roadmap,
            structure: roadmap.structure || defaultStructure
        }));
    },
    async getById(id) {
        const response = await api.get(`/roadmaps/${id}`);
        return response.data;
    },
    async create(roadmap) {
        const response = await api.post('/roadmaps', roadmap);
        return response.data;
    },
    async update(id, roadmap) {
        const response = await api.put(`/roadmaps/${id}`, roadmap);
        return response.data;
    },
    async delete(id) {
        await api.delete(`/roadmaps/${id}`);
    }
};
