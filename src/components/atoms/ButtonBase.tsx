import React from 'react';

// material icon
import { makeStyles } from '@material-ui/core/styles';
import Button, { ButtonProps } from '@material-ui/core/Button';

type IStyles = {
  width?: string;
  bgColor?: string;
  bgHoverColor?: string;
  textColor?: string;
  handleSubmit: ()=>void;
};

export type IButtonBaseProps = IStyles &
  ButtonProps & {
    text: string;
    className?: string;
  };

const useStyles = (props: IStyles) =>
  makeStyles(() => ({
    root: {
      width: props.width,
      display: 'inline-block',
      '& button': {
        color: props.textColor,
        backgroundColor: props.bgColor,
        '&:hover ': {
          color: "#2c3e50",
          backgroundColor: props.bgHoverColor,
        },
      },
    },
  }));

const ButtonBase = ({ text, width = 'auto', className, bgColor, bgHoverColor,textColor, handleSubmit, ...props }: IButtonBaseProps) => {
  const classes = useStyles({ width, bgColor, bgHoverColor,textColor,handleSubmit })();

  return (
    <div className={classes.root}>
      <Button fullWidth className={className} onClick={handleSubmit} {...props}>
        {text}
      </Button>
    </div>
  );
};

export default ButtonBase;