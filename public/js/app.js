function switchView(view) {
  // Hide all views
  document.getElementById('homeView').classList.add('hidden');
  document.getElementById('walletView').classList.add('hidden');
  document.getElementById('rewardsView').classList.add('hidden');
  document.getElementById('tasks').classList.add('hidden');

  // Show selected view
  if (view === 'tasks') {
    document.getElementById('tasks').classList.remove('hidden');
  } else {
    document.getElementById(view + 'View').classList.remove('hidden');
  }

  // Update navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  event.currentTarget.classList.add('active');
}

// Task and reward handling
function showTaskDetail(taskName) {
  if (tg && tg.showAlert) {
    tg.showAlert(`Task: ${taskName}\n\nIn the full app, you'll be able to accept this task and earn Time Credits!`);
  } else {
    alert(`Task: ${taskName}\n\nIn the full app, you'll be able to accept this task and earn Time Credits!`);
  }
}

function claimReward(rewardName) {
  if (tg && tg.showAlert) {
    tg.showAlert(`Claiming reward: ${rewardName}\n\nCongratulations! This reward is now yours.`);
  } else {
    alert(`Claiming reward: ${rewardName}\n\nCongratulations! This reward is now yours.`);
  }
}

// Invite functionality
function generateInviteCode() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `${timestamp}${random}`;
}

async function generateInviteLink() {
  const modal = document.getElementById('inviteModal');
  const linkText = document.getElementById('inviteLinkText');
  
  modal.classList.add('show');
  linkText.textContent = 'Generating link...';

  try {
    const inviteCode = generateInviteCode();
    const botUsername = 'YOUR_BOT_USERNAME';
    
    currentInviteLink = `https://t.me/${botUsername}?start=invite_${inviteCode}`;
    linkText.textContent = currentInviteLink;
  } catch (error) {
    console.error('Error generating invite:', error);
    linkText.textContent = 'Error generating link. Please try again.';
  }
}

function shareInviteLink() {
  if (tg && tg.openTelegramLink) {
    const shareText = encodeURIComponent(`Join our Neighbourly community! 🏡\n\n${currentInviteLink}`);
    tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(currentInviteLink)}&text=${shareText}`);
  } else if (navigator.share) {
    navigator.share({
      title: 'Join Neighbourly',
      text: 'Join our Neighbourly community! 🏡',
      url: currentInviteLink
    });
  } else {
    navigator.clipboard.writeText(currentInviteLink).then(() => {
      alert('Link copied to clipboard!');
    });
  }
}

function closeInviteModal() {
  document.getElementById('inviteModal').classList.remove('show');
}