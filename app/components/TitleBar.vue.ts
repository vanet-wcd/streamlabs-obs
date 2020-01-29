import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import electron from 'electron';
import { CustomizationService } from 'services/customization';
import { Inject } from 'services/core/injector';
import { StreamingService } from 'services/streaming';
import Utils from 'services/utils';
import { $t } from 'services/i18n';
import { WindowsService } from 'services/windows';

@Component({})
export default class TitleBar extends Vue {
  @Inject() customizationService: CustomizationService;
  @Inject() streamingService: StreamingService;
  @Inject() windowsService: WindowsService;

  @Prop() title: string;

  minimize() {
    electron.remote.getCurrentWindow().minimize();
  }

  get isMaximizable() {
    return electron.remote.getCurrentWindow().isMaximizable() !== false;
  }

  handleMousedown() {
    this.windowsService.updateStyleBlockers(Utils.getWindowId(), true);
  }

  handleMouseup() {
    this.windowsService.updateStyleBlockers(Utils.getWindowId(), false);
  }

  maximize() {
    const win = electron.remote.getCurrentWindow();

    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  }

  close() {
    if (Utils.isMainWindow() && this.streamingService.isStreaming) {
      if (!confirm($t('Are you sure you want to exit while live?'))) return;
    }

    electron.remote.getCurrentWindow().close();
  }

  get theme() {
    return this.customizationService.currentTheme;
  }
}
