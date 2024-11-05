export default function PreferencesStage({ formData, setFormData }: { formData: any; setFormData: any }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300">
          Year of Study
        </label>
        <select
          required
          className="form-select"
          value={formData.yearOfStudy}
          onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
        >
          <option value="">Select</option>
          <option value="1st">1st Year</option>
          <option value="2nd">2nd Year</option>
          <option value="3rd">3rd Year</option>
          <option value="4th">4th Year</option>
          <option value="5th">5th Year</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">
          Major/Field of Study
        </label>
        <input
          type="text"
          required
          placeholder="e.g., Computer Science"
          className="form-input"
          value={formData.major}
          onChange={(e) => setFormData({ ...formData, major: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">
          Interests
        </label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {['Coding', 'Gaming', 'Music', 'Sports', 'Art', 'Reading', 'Writing', 'Photography'].map((interest) => (
            <label key={interest} className="flex items-center space-x-2 p-2 rounded-lg bg-surface/50 cursor-pointer hover:bg-surface">
              <input
                type="checkbox"
                checked={formData.interests.includes(interest)}
                onChange={(e) => {
                  const newInterests = e.target.checked
                    ? [...formData.interests, interest]
                    : formData.interests.filter((i: string) => i !== interest);
                  setFormData({ ...formData, interests: newInterests });
                }}
                className="form-checkbox"
              />
              <span className="text-sm text-gray-300">{interest}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
} 