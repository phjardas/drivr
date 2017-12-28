/// <reference path="vue-material.d.ts" />
import Vue from 'vue';
import './material.scss';

import MdApp from 'vue-material/dist/components/MdApp';
import MdButton from 'vue-material/dist/components/MdButton';
import MdContent from 'vue-material/dist/components/MdContent';
import MdDatepicker from 'vue-material/dist/components/MdDatepicker';
import MdDivider from 'vue-material/dist/components/MdDivider';
import MdDrawer from 'vue-material/dist/components/MdDrawer';
import MdEmptyState from 'vue-material/dist/components/MdEmptyState';
import MdField from 'vue-material/dist/components/MdField';
import MdIcon from 'vue-material/dist/components/MdIcon';
import MdLayout from 'vue-material/dist/components/MdLayout';
import MdList from 'vue-material/dist/components/MdList';
import MdProgress from 'vue-material/dist/components/MdProgress';
import MdSnackbar from 'vue-material/dist/components/MdSnackbar';
import MdSpeedDial from 'vue-material/dist/components/MdSpeedDial';
import MdSubheader from 'vue-material/dist/components/MdSubheader';
import MdTabs from 'vue-material/dist/components/MdTabs';
import MdToolbar from 'vue-material/dist/components/MdToolbar';

[
  MdApp,
  MdButton,
  MdContent,
  MdDatepicker,
  MdDivider,
  MdDrawer,
  MdEmptyState,
  MdField,
  MdIcon,
  MdLayout,
  MdList,
  MdProgress,
  MdSnackbar,
  MdSpeedDial,
  MdSubheader,
  MdTabs,
  MdToolbar,
].forEach(Vue.use.bind(Vue));
