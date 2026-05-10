// @bun-test-dom happy-dom
import { expect, test, describe, beforeEach, afterEach } from 'bun:test';
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react';
import React from 'react';
import SacDashboard from './SacDashboard';

describe('SacDashboard', () => {
  let container: HTMLDivElement | null = null;
  let root: Root | null = null;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    if (root) {
      act(() => {
        root!.unmount();
      });
    }
    if (container && container.parentNode) {
      document.body.removeChild(container);
    }
    container = null;
    root = null;
  });

  test('renders dashboard title and status', async () => {
    await act(async () => {
      root!.render(React.createElement(SacDashboard));
    });

    expect(container?.textContent).toContain('SAC DASHBOARD');
    expect(container?.textContent).toContain('SYSTEM OPERATIONAL');
  });

  test('renders all metrics', async () => {
    await act(async () => {
      root!.render(React.createElement(SacDashboard));
    });

    const content = container?.textContent || '';
    expect(content).toContain('Uptime');
    expect(content).toContain('99.97%');
    expect(content).toContain('ROI Actual');
    expect(content).toContain('3,411%');
    expect(content).toContain('Ahorro Anual');
    expect(content).toContain('5.1M MXN');
    expect(content).toContain('Procesos Automatizados');
    expect(content).toContain('127');
  });

  test('renders active modules', async () => {
    await act(async () => {
      root!.render(React.createElement(SacDashboard));
    });

    const content = container?.textContent || '';
    expect(content).toContain('ACTIVE MODULES');
    expect(content).toContain('Monitor');
    expect(content).toContain('Validator');
    expect(content).toContain('Reporter');
    expect(content).toContain('Alerter');
    expect(content).toContain('Analyzer');
  });

  test('allows selecting a module', async () => {
    await act(async () => {
      root!.render(React.createElement(SacDashboard));
    });

    // Find the modules
    const moduleElements = container?.querySelectorAll('.cursor-pointer');
    if (!moduleElements || moduleElements.length === 0) throw new Error('Modules not found');

    const monitorModule = Array.from(moduleElements).find(m => m.textContent?.includes('Monitor')) as HTMLElement;
    const validatorModule = Array.from(moduleElements).find(m => m.textContent?.includes('Validator')) as HTMLElement;

    expect(monitorModule).toBeDefined();
    expect(validatorModule).toBeDefined();

    // Initial state check: Monitor should be selected (look for border-blue-500)
    expect(monitorModule.className).toContain('border-blue-500');
    expect(validatorModule.className).not.toContain('border-blue-500');

    // Click Validator
    await act(async () => {
      validatorModule.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    // Check updated state
    expect(validatorModule.className).toContain('border-blue-500');
    expect(monitorModule.className).not.toContain('border-blue-500');
  });

  test('displays version number', async () => {
    await act(async () => {
      root!.render(React.createElement(SacDashboard));
    });

    expect(container?.textContent).toContain('v5.0.0');
  });
});
