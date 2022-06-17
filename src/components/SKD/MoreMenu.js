import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import { Button } from "antd";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

export default function MoreMenu(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  //  let openDialog1 = useSelector((state) => state.global.openDialog1);
  let icon = <MoreVertIcon />;
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  // useEffect(() => {
  //   if (!openDialog1) setAnchorEl(null);

  // }, [openDialog1]);
  const handleClose = () => {
    setAnchorEl(null);
  };
  if (props.icon) icon = props.icon;

  return (
    <div>
      {props.button ? (
        <Button icon={icon} onClick={handleClick} />
      ) : (
        <IconButton aria-label="settings" onClick={handleClick}>
          {icon}
        </IconButton>
      )}
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        // keepMounted
        open={Boolean(anchorEl)}
        //open={open}
        onClose={handleClose}
      >
        {props.menu.map((k, i) => {
          return (
            <MenuItem
              key={`moremenu${i}`}
              onClick={() => {
                k.onClick();
                setAnchorEl(null);
              }}
            >
              {k.title}
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
}
