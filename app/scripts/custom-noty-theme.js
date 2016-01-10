'use strict';
$.noty.themes.customTheme = {
  name: 'customTheme',
  modal: {
    css: {
      position: 'fixed',
      width: '100%',
      height: '100%',
      backgroundColor: '#000',
      zIndex: 10000,
      opacity: 0.6,
      display: 'none',
      left: 0,
      top: 0
    }
  },
  style: function() {

    this.$bar.css({
      overflow: 'hidden'
    });

    this.$message.css({
      fontSize: '15px',
      lineHeight: '20px',
      textAlign: 'left',
      padding: '10px 10px 10px 15px',
      width: 'auto',
      position: 'relative'
    });

    this.$closeButton.css({
      position: 'absolute',
      top: 4,
      right: 4,
      width: 10,
      height: 10,
      display: 'none',
      cursor: 'pointer'
    });

    this.$buttons.css({
      padding: 5,
      textAlign: 'right',
      borderTop: '1px solid #ccc',
      backgroundColor: '#fff'
    });

    this.$buttons.find('button').css({
      marginLeft: 5
    });

    this.$buttons.find('button:first').css({
      marginLeft: 0
    });

    this.$bar.on({
      mouseenter: function() {
        $(this).find('.noty_close').stop().fadeTo('normal', 1);
      },
      mouseleave: function() {
        $(this).find('.noty_close').stop().fadeTo('normal', 0);
      }
    });

    switch (this.options.type) {
      case 'alert':
      case 'notification':
        this.$bar.css({
          backgroundColor: '#FFF',
          borderColor: '#CCC',
          color: '#444'
        });
        break;
      case 'warning':
        this.$bar.css({
          backgroundColor: '#FFEAA8',
          borderColor: '#FFC237',
          color: '#826200'
        });
        this.$buttons.css({
          borderTop: '1px solid #FFC237'
        });
        break;
      case 'error':
        this.$bar.css({
          backgroundColor: 'red',
          borderColor: 'darkred',
          color: '#FFF'
        });
        this.$message.css({
          fontWeight: 'bold'
        });
        this.$buttons.css({
          borderTop: '1px solid darkred'
        });
        break;
      case 'information':
        this.$bar.css({
          backgroundColor: '#0495cc',
          borderColor: 'transparent',
          color: '#FFF'
        });
        this.$buttons.css({
          borderTop: '1px solid #0495cc'
        });
        break;
      case 'success':
        this.$bar.css({
          backgroundColor: '#4cc148',
          color: '#FFF'
        });
        this.$buttons.css({
          borderTop: '1px solid #50C24E'
        });
        break;
      default:
        this.$bar.css({
          backgroundColor: '#FFF',
          borderColor: '#CCC',
          color: '#444'
        });
        break;
    }
  },
  callback: {
    onShow: function() {
    },
    onClose: function() {
    }
  }
};
