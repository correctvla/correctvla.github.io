import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

plt.rcParams.update({
    'font.family': 'sans-serif',
    'font.sans-serif': ['Helvetica', 'Arial'],
    'font.size': 13,
    'axes.spines.top': False,
    'axes.spines.right': False,
})

# ── Chart 1: Simulation Results (Table I) ──────────────────────────────
fig, axes = plt.subplots(1, 2, figsize=(12, 4.5))

# Success Rate
categories = ['In-Distribution', 'Out-of-Distribution']
pi05 = [93.0, 27.1]
ours = [96.3, 34.4]

x = np.arange(len(categories))
w = 0.32

bars1 = axes[0].bar(x - w/2, pi05, w, label='π0.5', color='#bdc3c7', edgecolor='white', linewidth=0.5)
bars2 = axes[0].bar(x + w/2, ours, w, label='CorrectVLA (Ours)', color='#2ecc71', edgecolor='white', linewidth=0.5)

axes[0].set_ylabel('Success Rate (%)')
axes[0].set_title('Success Rate', fontweight='bold', fontsize=14)
axes[0].set_xticks(x)
axes[0].set_xticklabels(categories)
axes[0].set_ylim(0, 110)
axes[0].legend(loc='upper right', framealpha=0.9)

for bar, val in zip(bars1, pi05):
    axes[0].text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1.5, f'{val}%', ha='center', va='bottom', fontsize=11, fontweight='bold', color='#555')
for bar, val in zip(bars2, ours):
    axes[0].text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1.5, f'{val}%', ha='center', va='bottom', fontsize=11, fontweight='bold', color='#27ae60')

# Recovery Rate
recovery_pi05 = [0, 0]
recovery_vlm = [0, 0]
recovery_ours = [46.8, 10.1]

bars1 = axes[1].bar(x - w, recovery_pi05, w, label='π0.5', color='#bdc3c7', edgecolor='white', linewidth=0.5)
bars2 = axes[1].bar(x, recovery_vlm, w, label='VLM Baseline', color='#e74c3c', edgecolor='white', linewidth=0.5, alpha=0.7)
bars3 = axes[1].bar(x + w, recovery_ours, w, label='CorrectVLA (Ours)', color='#2ecc71', edgecolor='white', linewidth=0.5)

axes[1].set_ylabel('Recovery Rate (%)')
axes[1].set_title('Recovery Rate', fontweight='bold', fontsize=14)
axes[1].set_xticks(x)
axes[1].set_xticklabels(categories)
axes[1].set_ylim(0, 60)
axes[1].legend(loc='upper right', framealpha=0.9)

for bar, val in zip(bars3, recovery_ours):
    axes[1].text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1, f'{val}%', ha='center', va='bottom', fontsize=11, fontweight='bold', color='#27ae60')

# Add "0%" labels for baselines
for bar in bars1:
    axes[1].text(bar.get_x() + bar.get_width()/2, 1, '0%', ha='center', va='bottom', fontsize=9, color='#999')
for bar in bars2:
    axes[1].text(bar.get_x() + bar.get_width()/2, 1, '0%', ha='center', va='bottom', fontsize=9, color='#999')

fig.suptitle('Table I: Simulation Results (LIBERO)', fontsize=16, fontweight='bold', y=1.02)
plt.tight_layout()
plt.savefig('/Users/owen/Projects/project-cvla/static/images/chart_simulation.png', dpi=200, bbox_inches='tight', facecolor='white')
plt.close()
print("chart_simulation.png saved")


# ── Chart 2: Real-Robot Results (Table II) ─────────────────────────────
fig, ax = plt.subplots(figsize=(10, 5.5))

conditions = ['Same\nLocation', 'Different\nLocation', 'Different\nObj + Loc', 'Total']
pi05_real = [10, 0, 20, 10]
ours_real = [100, 100, 80, 95]

x = np.arange(len(conditions))
w = 0.32

bars1 = ax.bar(x - w/2, pi05_real, w, label='π0.5', color='#e74c3c', edgecolor='white', linewidth=0.5, alpha=0.75)
bars2 = ax.bar(x + w/2, ours_real, w, label='CorrectVLA (Ours)', color='#2ecc71', edgecolor='white', linewidth=0.5)

ax.set_ylabel('Success Rate (%)')
ax.set_xticks(x)
ax.set_xticklabels(conditions)
ax.set_ylim(0, 125)
ax.legend(loc='upper center', framealpha=0.9, ncol=2)

# Annotations
trial_labels_pi05 = ['1/10', '0/5', '1/5', '2/20']
trial_labels_ours = ['10/10', '5/5', '4/5', '19/20']

for bar, pct, trials in zip(bars1, pi05_real, trial_labels_pi05):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1.5, f'{pct}%\n({trials})', ha='center', va='bottom', fontsize=10, fontweight='bold', color='#c0392b')

for bar, pct, trials in zip(bars2, ours_real, trial_labels_ours):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1.5, f'{pct}%\n({trials})', ha='center', va='bottom', fontsize=10, fontweight='bold', color='#27ae60')

# Highlight total
ax.axvline(x=2.5, color='#ccc', linestyle='--', linewidth=1)

ax.set_title('Table II: Real-Robot Results (xArm7, Pick-and-Place)', fontsize=16, fontweight='bold', pad=15)

# Footnote
ax.text(0.5, -0.18, '† π0.5 achieves 95% (19/20) before base shift. After shift: 10% (2/20).',
        ha='center', transform=ax.transAxes, fontsize=10, color='#777', style='italic')

plt.tight_layout()
plt.savefig('/Users/owen/Projects/project-cvla/static/images/chart_real_robot.png', dpi=200, bbox_inches='tight', facecolor='white')
plt.close()
print("chart_real_robot.png saved")
