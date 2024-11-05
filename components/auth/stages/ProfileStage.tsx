export default function ProfileStage({ formData, setFormData }: { formData: any; setFormData: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Gender
          </label>
          <select
            required
            className="form-select"
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Age
          </label>
          <input
            type="number"
            required
            min="16"
            max="100"
            className="form-input"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">
          Personality Type
        </label>
        <select
          required
          className="form-select"
          value={formData.personality}
          onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
        >
          <option value="">Select</option>
          <option value="Introvert">Introvert</option>
          <option value="Extrovert">Extrovert</option>
          <option value="Ambivert">Ambivert</option>
        </select>
      </div>
    </div>
  );
} 