import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { getContentBySection } from '../../services/contentServices';
import ContentViewer from '../CourseDetail/ContentViewer';
import { Loader2 } from 'lucide-react';
const SectionContent = ({ sectionId, courseId }) => {
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchContent = async () => {
            try {
                setLoading(true);
                const data = await getContentBySection(sectionId);
                setContents(data);
                setError(null);
            }
            catch (err) {
                setError('Failed to load content. Please try again later.');
            }
            finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, [sectionId]);
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-[200px]", children: _jsx(Loader2, { className: "w-8 h-8 animate-spin text-blue-600" }) }));
    }
    if (error) {
        return (_jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4 text-red-700", children: error }));
    }
    if (contents.length === 0) {
        return (_jsx("div", { className: "bg-gray-50 border border-gray-200 rounded-lg p-8 text-center", children: _jsx("p", { className: "text-gray-600", children: "No content available for this section." }) }));
    }
    return (_jsx("div", { className: "space-y-6", children: contents.map((content) => (_jsx(ContentViewer, { content: content, courseId: courseId }, content.id))) }));
};
export default SectionContent;
