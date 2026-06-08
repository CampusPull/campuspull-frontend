// Filter configuration for Resources Hub platform

export const RESOURCE_TYPES = {
  ALL: 'all',
  NOTES: 'notes',
  PYQS: 'pyqs',
  ROADMAPS: 'roadmaps'
};

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First', icon: 'Clock' },
  { value: 'popular', label: 'Most Popular', icon: 'TrendingUp' },
  { value: 'rating', label: 'Highest Rated', icon: 'Star' },
  { value: 'downloads', label: 'Most Downloaded', icon: 'Download' },
  { value: 'views', label: 'Most Viewed', icon: 'Eye' }
];

export const BRANCH_OPTIONS = [
  { value: 'CSE', label: 'Computer Science' },
  { value: 'ECE', label: 'Electronics & Communication' },
  { value: 'Mechanical', label: 'Mechanical Engineering' },
  { value: 'Civil', label: 'Civil Engineering' },
  { value: 'Electrical', label: 'Electrical Engineering' },
  { value: 'IT', label: 'Information Technology' }
];

export const SEMESTER_OPTIONS = [
  { value: '1', label: 'Semester 1' },
  { value: '2', label: 'Semester 2' },
  { value: '3', label: 'Semester 3' },
  { value: '4', label: 'Semester 4' },
  { value: '5', label: 'Semester 5' },
  { value: '6', label: 'Semester 6' },
  { value: '7', label: 'Semester 7' },
  { value: '8', label: 'Semester 8' }
];

export const DIFFICULTY_OPTIONS = [
  { value: 'Easy', label: 'Easy', color: 'bg-emerald-50 text-emerald-700 border-emerald-200/50' },
  { value: 'Medium', label: 'Medium', color: 'bg-amber-50 text-amber-700 border-amber-200/50' },
  { value: 'Hard', label: 'Hard', color: 'bg-rose-50 text-rose-700 border-rose-200/50' }
];

export const POPULAR_TAG_OPTIONS = [
  { value: 'React', label: 'React' },
  { value: 'JavaScript', label: 'JavaScript' },
  { value: 'DBMS', label: 'DBMS' },
  { value: 'OS', label: 'Operating Systems' },
  { value: 'DSA', label: 'Data Structures & Algorithms' },
  { value: 'System Design', label: 'System Design' },
  { value: 'Computer Networks', label: 'Computer Networks' },
  { value: 'Python', label: 'Python' },
  { value: 'Java', label: 'Java' },
  { value: 'C++', label: 'C++' }
];

export const POPULAR_COMPANY_OPTIONS = [
  { value: 'Google', label: 'Google' },
  { value: 'Microsoft', label: 'Microsoft' },
  { value: 'Amazon', label: 'Amazon' },
  { value: 'Meta', label: 'Meta' },
  { value: 'Netflix', label: 'Netflix' },
  { value: 'Adobe', label: 'Adobe' },
  { value: 'Apple', label: 'Apple' },
  { value: 'Goldman Sachs', label: 'Goldman Sachs' },
  { value: 'Uber', label: 'Uber' },
  { value: 'TCS', label: 'TCS' },
  { value: 'Infosys', label: 'Infosys' }
];

// Helper to check if a resource has verified tag or verified field
export const isResourceVerified = (resource) => {
  return resource?.verified === true;
};
