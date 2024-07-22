import "./App.css";
import Plot from "react-plotly.js";
import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';

function App() {
  const [fileContent, setFileContent] = useState('');
  const [values, setValues] = useState(["60", "50", "40", "30", "40", "40", "10"]);
  const [labels, setLabels] = useState(["Produce", "by", "NullDEATH", "⭐", "Happy", "Coding", "!"]);
  const [parents, setParents] = useState(["", "Produce", "by", "NullDEATH", "", "Happy", "Coding"]);
  const [hoverinfo, setHoverinfo] = useState(["", "", "", "", "", "", ""])
  const [alignment, setAlignment] = useState('treemap');
  const [color, setColor] = React.useState('Electric');
  const [reverse, setReverse] = React.useState(false);
  const [bar, setBar] = React.useState(true);
  const [depth, setDepth] = React.useState(4);

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const handleColorChange = (event) => {
    setColor(event.target.value);
  };

  const handleReverseChange = (event) => {
    setReverse(event.target.checked);
  };

  const handleBarChange = (event) => {
    setBar(event.target.checked);
  };

  const handleDepthChange = (event) => {
    setDepth(event.target.value);
  };

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const fileContent = e.target.result;
        setFileContent(fileContent);
        parseFileContent(fileContent); // 解析文件内容
      };

      reader.readAsText(file);
    }
  };

  const parseFileContent = (content) => {
    // 按行分割文件内容
    const lines = content.split('\n');

    let currentLabel = '';
    let currentValue = '';
    let currentPerc = '';
    let isCollectingData = false;
    let labels = [];
    let values = [];
    let parents = [];
    let percent = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // 跳过以特定模式开头的行，例如长横线
      if (/^-+$/.test(trimmedLine)) {
        return; // 跳过这一行
      }

      console.log(line)

      if (trimmedLine.startsWith('Total')) {
        isCollectingData = true;
        console.log("start")
      } else if (isCollectingData && trimmedLine !== '' && !trimmedLine.startsWith('Total')) {
        // 处理数据行
        const columns = trimmedLine.split(/\s+/).filter(column => column.length > 0);
        console.log(columns, columns.length)

        if (columns.length == 1) {
          currentLabel = columns[0].trim()
        }
        else if (columns.length == 6) {
          currentValue = parseFloat(columns[0])
          currentPerc = columns[5]
        } else {
          currentLabel = columns[0].trim()
          currentValue = parseFloat(columns[1])
          currentPerc = columns[6]
        }

        if (currentLabel && currentValue && !isNaN(currentValue)) {
          labels.push(currentLabel);
          values.push(currentValue);
          percent.push(currentPerc);
          currentLabel = ''; // 重置当前标签
          currentValue = '';
          currentPerc = '';
        }
      } else if (trimmedLine.startsWith('Total')) {
        // 到达总行，停止收集数据
        isCollectingData = false;
      }
    });

    const units = labels

    // 初始化父单元数组，根节点的父单元为空字符串
    let currentParent = ''

    // 用于记录不同层级的最近父单元
    let lastParentByLevel = {
      0: "" // 根节点层级为0，其父单元为空字符串
    };

    units.forEach((unit, index) => {
      if (index === 0) {
        parents.push("");
        lastParentByLevel[1] = unit
        return; // 跳过根节点
      }

      // 计算当前单元的层级
      const level = unit.split('/').length + 1;

      // 寻找最近的父单元
      currentParent = lastParentByLevel[level - 1];
      lastParentByLevel[level] = unit;

      // 添加父单元到数组
      parents.push(currentParent);
    });

    // 更新状态
    setLabels(labels);
    setValues(values);
    setParents(parents);
    setHoverinfo(percent);
    console.log("Labels:", labels);
    console.log("Values:", values);
    console.log("Parents:", parents);
  };

  var data = [{
    type: alignment,
    name: 'Synthesis Area Charts',
    values: values,
    labels: labels,
    parents: parents,
    hovertext: hoverinfo,
    branchvalues: "total",
    hoverinfo: "label+value+percent root+percent parent+text",
    maxdepth: depth,
    marker: {
      "colorscale": color,
      "reversescale": reverse,
      "showscale": bar,
    },
  }]

  return (
    <div
      className="App"
    >
      <Plot
        data={data}
        layout={{
          title: "DC Synthesis Area Charts",
          margin: { l: 40, r: 20, t: 60, b: 20 },
          autosize: true,
        }}
        style={{
          width: "100%",
          height: "80%"
        }}
        useResizeHandler={true}
        config={{ responsive: true }}
      />
      <Stack direction="row" spacing={2} sx={{
        '& > :first-child': { // 选择第一个子元素
          marginLeft: 5, // 向左缩进
        },
      }}>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
          size="medium"
        >
          Synthesis Area Report
          <VisuallyHiddenInput type="file" onChange={handleFileChange} />
        </Button>
        <ToggleButtonGroup
          color="primary"
          value={alignment}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
          size="medium"
        >
          <ToggleButton value="treemap">treemap</ToggleButton>
          <ToggleButton value="icicle">icicle</ToggleButton>
          <ToggleButton value="sunburst">sunburst</ToggleButton>
        </ToggleButtonGroup>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="depth-select-standard-label">Maxdepth</InputLabel>
          <Select
            labelId="depth-select-standard-label"
            id="depth-select-standard"
            value={depth}
            onChange={handleDepthChange}
            label="Maxdepth"
          >
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>
              <em>4</em>
            </MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={6}>6</MenuItem>
            <MenuItem value={7}>7</MenuItem>
            <MenuItem value={8}>8</MenuItem>
            <MenuItem value={-1}>No Limit</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="simple-select-standard-label">Colorscale</InputLabel>
          <Select
            labelId="simple-select-standard-label"
            id="simple-select-standard"
            value={color}
            onChange={handleColorChange}
            label="Colorscale"
          >
            <MenuItem value="Electric">
              <em>Electric</em>
            </MenuItem>
            <MenuItem value="Blackbody">Blackbody</MenuItem>
            <MenuItem value="Bluered">Bluered</MenuItem>
            <MenuItem value="Blues">Blues</MenuItem>
            <MenuItem value="Cividis">Cividis</MenuItem>
            <MenuItem value="Earth">Earth</MenuItem>
            <MenuItem value="Greens">Greens</MenuItem>
            <MenuItem value="Greys">Greys</MenuItem>
            <MenuItem value="Hot">Hot</MenuItem>
            <MenuItem value="Jet">Jet</MenuItem>
            <MenuItem value="Picnic">Picnic</MenuItem>
            <MenuItem value="Portland">Portland</MenuItem>
            <MenuItem value="Rainbow">Rainbow</MenuItem>
            <MenuItem value="RdBu">RdBu</MenuItem>
            <MenuItem value="Reds">Reds</MenuItem>
            <MenuItem value="Viridis">Viridis</MenuItem>
            <MenuItem value="YlGnBu">YlGnBu</MenuItem>
            <MenuItem value="YlOrRd">YlOrRd</MenuItem>
          </Select>
        </FormControl>
        <FormGroup row={true}>
          <FormControlLabel control={<Switch onChange={handleReverseChange} />} label="Reverse Colorscale" />
          <FormControlLabel control={<Switch defaultChecked onChange={handleBarChange} />} label="Show Colorscale Bar" />
        </FormGroup>
      </Stack>
      {fileContent && (
        <div class="vertical-scroll">
          <h2>File Content:</h2>
          <pre>{fileContent}</pre> {/* 展示文件内容 */}
        </div>
      )}
    </div>
  );
}

export default App;
