import { Autocomplete, Box, TextField } from "@mui/material";
import { Icon } from "@iconify/react";
import { getIndustryIcon } from "../../config/industryIcons";

export default function FilterAreaAndSkill({
  areas,
  skills,
  customFilters,
  setCustomFilters,
  onFilterChange, // Callback to trigger data fetch
  onSearchSkills, // Callback to search skills
}) {
  return (
    <div className="flex gap-4 mb-3">
      <Autocomplete
        id="areas-select"
        size="small"
        sx={{
          width: "min-content",
          minWidth: "460px",
        }}
        options={areas || []}
        autoHighlight
        getOptionLabel={(option) => option.name + " - " + option.industry.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={(_, value) => {
          setCustomFilters((prev) => ({
            ...prev,
            area_id: value?.id || null,
            area: value || null, // Store the full object
          }));
          // Trigger data fetch after state update
          if (onFilterChange) {
            onFilterChange();
          }
        }}
        value={customFilters.area || null}
        renderOption={(props, option) => {
          const { key, ...optionProps } = props;
          return (
            <Box
              key={key}
              component="li"
              {...optionProps}
              className="hover:text-black text-sm md:text-md py-0.5 px-8 flex gap-3 my-1 cursor-pointer"
            >
              {option.name}
              <p className="flex gap-1 text-black/40 text-xs mt-1">
                <Icon icon={getIndustryIcon(option.industry_id)} width={16} />
                {option.industry.name}
              </p>
            </Box>
          );
        }}
        renderInput={(params) => (
          <TextField label="Área de especialización" {...params} />
        )}
      />

      <Autocomplete
        id="skills-select"
        multiple
        size="small"
        options={skills || []}
        autoHighlight
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={(_, value) => {
          // Store both the array of objects and the comma-separated string
          const skillsString = value.map((skill) => skill.name).join(",");

          setCustomFilters((prev) => ({
            ...prev,
            skills: skillsString,
            skillsArray: value, // Store the array for the Autocomplete value
          }));

          // Trigger data fetch after state update
          if (onFilterChange) {
            onFilterChange();
          }
        }}
        sx={{
          width: "min-content",
          minWidth: "400px",
        }}
        value={customFilters.skillsArray || []}
        onInputChange={(_, value) => {
          if (onSearchSkills) {
            onSearchSkills(value);
          }
        }}
        renderInput={(params) => (
          <TextField {...params} label="Habilidades" placeholder="Buscar habilidad..." />
        )}
      />
    </div>
  );
}
