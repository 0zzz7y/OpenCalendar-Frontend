import React, { useState } from "react"
import { Box, Typography } from "@mui/material"
import { Select } from "@/components/library/Select"

const TestPage = () => {
  const [value, setValue] = useState("option1")

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h6" gutterBottom>
        Custom Select
      </Typography>
      <Box sx={{ maxWidth: 300 }}>
        <Select
          label="Choose Option"
          value={value}
          onChange={setValue}
          options={[
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" },
          ]}
        />
      </Box>
    </Box>
  )
}

export default TestPage
