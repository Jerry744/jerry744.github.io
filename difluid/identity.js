// Controls shared by identity.html and applications.html. No automatic playback.
const logoStage = document.querySelector('#logo-stage');
if (logoStage) {
  const preview = document.querySelector('#logo-preview');
  let variant = 'primary';
  let tone = 'dark';
  const update = () => {
    logoStage.dataset.tone = tone;
    preview.src = `assets/${variant === 'monochrome' ? 'mono' : 'logo'}-${tone === 'dark' ? 'light' : 'dark'}.svg`;
    preview.alt = `DiFluid ${variant === 'primary' ? 'primary' : 'monochrome'} wordmark on a ${tone} background`;
    document.querySelectorAll('[data-logo]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.logo === variant)));
    document.querySelectorAll('[data-logo-tone]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.logoTone === tone)));
    document.querySelector('#logo-context-en').textContent = variant === 'primary'
      ? 'The primary wordmark pairs the DiFluid name with a small Sense accent. Keep its proportions and original artwork intact.'
      : 'The monochrome wordmark is a single-color alternative. Preview the original light or dark asset for the intended surface.';
    document.querySelector('#logo-context-zh').textContent = variant === 'primary'
      ? '主字标以 DiFluid 名称与少量 Sense 点缀建立识别，保留原始比例与图形。'
      : '单色字标提供单一颜色的应用选择。根据展示背景，预览对应的浅色或深色原始素材。';
  };
  document.querySelectorAll('[data-logo]').forEach(button => button.addEventListener('click', () => {variant = button.dataset.logo; update();}));
  document.querySelectorAll('[data-logo-tone]').forEach(button => button.addEventListener('click', () => {tone = button.dataset.logoTone; update();}));
  update();
}

const motion = document.querySelector('#logo-motion');
if (motion) {
  const toggle = document.querySelector('#motion-toggle');
  const status = document.querySelector('#motion-status');
  const update = () => {
    toggle.innerHTML = motion.paused ? 'Play <span lang="zh-CN">播放</span>' : 'Pause <span lang="zh-CN">暂停</span>';
    status.textContent = motion.ended ? 'Finished · 播放结束' : motion.paused ? 'Paused · 已暂停' : 'Playing · 播放中';
  };
  const play = async () => {
    try { await motion.play(); } catch { status.textContent = 'Playback unavailable. Try the video controls. · 暂时无法播放，请尝试视频原生控件。'; }
  };
  toggle.addEventListener('click', () => motion.paused ? play() : motion.pause());
  document.querySelector('#motion-restart').addEventListener('click', () => {motion.currentTime = 0; play();});
  ['play', 'pause', 'ended'].forEach(event => motion.addEventListener(event, update));
  motion.addEventListener('error', () => {status.textContent = 'Video could not load. · 视频暂时无法加载。';});
}

const tokens = {
  depth10: ['--brand-depth-10', 'Depth / 10 provides the quiet background field. It lets imagery, information, and the signal take precedence.', 'Depth / 10 构成安静的背景场，让图像、信息与信号成为关注中心。'],
  depth20: ['--brand-depth-20', 'Depth / 20 gives a surface a little more presence. A subtle step in lightness can group information without adding decoration.', 'Depth / 20 让承载信息的表面稍显轮廓。以细微的明度变化组织内容，减少装饰。'],
  depth30: ['--brand-depth-30', 'Depth / 30 offers another neutral level for structure and separation. These primitives still need contextual semantic roles in a product interface.', 'Depth / 30 为结构与分隔提供中性色阶。在产品界面中，仍需按具体语境映射语义角色。'],
  depth100: ['--brand-depth-100', 'Depth / 100 is the highest lightness in the Depth system, rather than pure white. It supports clear foreground content against the dark field.', 'Depth / 100 是 Depth 系统的最高明度，并非纯白。它让前景信息在深色场域中保持清晰。'],
  sense50: ['--brand-sense-50', 'Sense / 50 is the brand green: #5ECDBD. Reserve it for a precise signal such as detection, focus, selection, or an insight.', 'Sense / 50 是品牌主题绿：#5ECDBD。将它留给检测、聚焦、选中或洞察等精确的信号。']
};
document.querySelectorAll('[data-token]').forEach(button => button.addEventListener('click', () => {
  const value = tokens[button.dataset.token];
  if (!value) return;
  document.querySelectorAll('[data-token]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  document.querySelector('#token-property').textContent = value[0];
  document.querySelector('#token-description-en').textContent = value[1];
  document.querySelector('#token-description-zh').textContent = value[2];
}));

const applications = {
  mug: {number: '01 / 03', title: 'Mug', zh: '马克杯', en: 'A familiar object makes the brand part of the daily coffee ritual. Let the mark remain legible without overwhelming the object.', description: '以熟悉的物件融入每日咖啡仪式。标志保持清晰，为器物本身留下空间。'},
  pitcher: {number: '02 / 03', title: 'Pitcher', zh: '拉花缸', en: 'A working tool brings the identity into the making of coffee. Review the mark alongside the silhouette, handle, and way the object is held.', description: '让品牌进入制作咖啡的过程。结合器物轮廓、把手与握持方式，评估标志的位置与识别。'},
  bottle: {number: '03 / 03', title: 'Bottle', zh: '水瓶', en: 'A portable object carries recognition beyond the coffee station. Consider the curved surface and the changing angle of everyday use.', description: '可携带的物件，让识别走出咖啡工作台。考虑曲面，以及日常使用中变化的观看角度。'}
};
document.querySelectorAll('[data-application]').forEach(button => button.addEventListener('click', () => {
  const key = button.dataset.application;
  const value = applications[key];
  if (!value) return;
  document.querySelectorAll('[data-application]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  const picture = document.querySelector('#application-image');
  picture.src = `assets/${key}.webp`;
  picture.alt = `DiFluid ${value.title.toLowerCase()} application visual concept study`;
  document.querySelector('#application-number').textContent = value.number;
  document.querySelector('#application-title').innerHTML = `${value.title} <span lang="zh-CN">${value.zh}</span>`;
  document.querySelector('#application-description-en').textContent = value.en;
  document.querySelector('#application-description-zh').textContent = value.description;
}));
