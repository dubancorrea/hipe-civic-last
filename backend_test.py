#!/usr/bin/env python3
"""
HIPE Civic Backend API Test Suite
Tests all backend endpoints as specified in the review request.
"""

import requests
import json
import random
import string
import re
from urllib.parse import parse_qs, urlparse

# Base URL from environment
BASE_URL = "https://6a4026d9-d91c-47da-9651-c6ba2981134e.preview.emergentagent.com"

def generate_random_string(length=8):
    """Generate random string for unique emails"""
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))

def test_scenario(scenario_num, description, test_func):
    """Test wrapper with consistent output"""
    print(f"\n{'='*60}")
    print(f"SCENARIO {scenario_num}: {description}")
    print('='*60)
    try:
        result = test_func()
        if result:
            print(f"✅ SCENARIO {scenario_num} PASSED")
        else:
            print(f"❌ SCENARIO {scenario_num} FAILED")
        return result
    except Exception as e:
        print(f"❌ SCENARIO {scenario_num} FAILED with exception: {str(e)}")
        return False

def main():
    """Run all test scenarios"""
    session = requests.Session()
    test_data = {}
    
    # Generate unique test data
    student_rand = generate_random_string()
    staff_rand = generate_random_string()
    test_data['student_email'] = f"student_{student_rand}@cuny.edu"
    test_data['staff_email'] = f"staff_{staff_rand}@cuny.edu"
    test_data['student_password'] = "StudentPass1!"
    test_data['staff_password'] = "StaffPass1!"
    test_data['new_password'] = "NewStudent2!"
    
    print(f"🚀 Starting HIPE Civic Backend API Tests")
    print(f"📍 Base URL: {BASE_URL}")
    print(f"👤 Student Email: {test_data['student_email']}")
    print(f"👨‍💼 Staff Email: {test_data['staff_email']}")
    
    results = []
    
    # Scenario 1: Signup student
    def test_signup_student():
        url = f"{BASE_URL}/api/auth/signup"
        payload = {
            "name": "Test Student",
            "email": test_data['student_email'],
            "password": test_data['student_password'],
            "role": "student",
            "school": "BMCC",
            "major": "Computer Science"
        }
        response = session.post(url, json=payload)
        print(f"Request: POST {url}")
        print(f"Payload: {json.dumps(payload, indent=2)}")
        print(f"Response Status: {response.status_code}")
        print(f"Response Body: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('ok') and data.get('user'):
                test_data['student_id'] = data['user']['id']
                return True
        return False
    
    results.append(test_scenario(1, "Signup student", test_signup_student))
    
    # Scenario 2: Signup staff
    def test_signup_staff():
        url = f"{BASE_URL}/api/auth/signup"
        payload = {
            "name": "Test Staff",
            "email": test_data['staff_email'],
            "password": test_data['staff_password'],
            "role": "staff"
        }
        response = session.post(url, json=payload)
        print(f"Request: POST {url}")
        print(f"Payload: {json.dumps(payload, indent=2)}")
        print(f"Response Status: {response.status_code}")
        print(f"Response Body: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('ok') and data.get('user'):
                test_data['staff_id'] = data['user']['id']
                return True
        return False
    
    results.append(test_scenario(2, "Signup staff", test_signup_staff))
    
    # Scenario 3: Login student via NextAuth
    def test_login_student():
        # Get CSRF token
        csrf_url = f"{BASE_URL}/api/auth/csrf"
        csrf_response = session.get(csrf_url)
        print(f"CSRF Request: GET {csrf_url}")
        print(f"CSRF Response Status: {csrf_response.status_code}")
        print(f"CSRF Response Body: {csrf_response.text}")
        
        if csrf_response.status_code != 200:
            return False
            
        csrf_data = csrf_response.json()
        csrf_token = csrf_data.get('csrfToken')
        if not csrf_token:
            print("❌ No CSRF token received")
            return False
        
        # Login with credentials
        login_url = f"{BASE_URL}/api/auth/callback/credentials?json=true"
        login_payload = {
            'csrfToken': csrf_token,
            'email': test_data['student_email'],
            'password': test_data['student_password'],
            'callbackUrl': '/dashboard',
            'json': 'true'
        }
        
        login_response = session.post(login_url, data=login_payload)
        print(f"Login Request: POST {login_url}")
        print(f"Login Payload: {login_payload}")
        print(f"Login Response Status: {login_response.status_code}")
        print(f"Login Response Body: {login_response.text}")
        print(f"Login Response Headers: {dict(login_response.headers)}")
        
        # Check for session cookie
        cookies = session.cookies
        print(f"Session Cookies: {dict(cookies)}")
        
        has_session_cookie = any('next-auth.session-token' in name or '__Secure-next-auth.session-token' in name 
                                for name in cookies.keys())
        
        if login_response.status_code == 200 and has_session_cookie:
            return True
        return False
    
    results.append(test_scenario(3, "Login student via NextAuth", test_login_student))
    
    # Scenario 4: Check session and get opportunities
    def test_session_and_opportunities():
        # Check session
        session_url = f"{BASE_URL}/api/auth/session"
        session_response = session.get(session_url)
        print(f"Session Request: GET {session_url}")
        print(f"Session Response Status: {session_response.status_code}")
        print(f"Session Response Body: {session_response.text}")
        
        if session_response.status_code != 200:
            return False
            
        session_data = session_response.json()
        if not session_data.get('user') or session_data['user'].get('role') != 'student':
            print("❌ Session check failed - not logged in as student")
            return False
        
        # Get opportunities list
        opps_url = f"{BASE_URL}/api/opportunities/list"
        opps_response = session.get(opps_url)
        print(f"Opportunities Request: GET {opps_url}")
        print(f"Opportunities Response Status: {opps_response.status_code}")
        print(f"Opportunities Response Body: {opps_response.text[:500]}...")
        
        if opps_response.status_code != 200:
            return False
            
        opps_data = opps_response.json()
        opportunities = opps_data.get('opportunities', [])
        print(f"Number of opportunities: {len(opportunities)}")
        
        if len(opportunities) >= 14:
            # Check structure
            first_opp = opportunities[0]
            required_fields = ['id', 'title', 'category', 'major']
            if all(field in first_opp for field in required_fields):
                return True
        
        return False
    
    results.append(test_scenario(4, "Check session and get opportunities (>=14)", test_session_and_opportunities))
    
    # Scenario 5: Apply to opportunity
    def test_apply_opportunity():
        apply_url = f"{BASE_URL}/api/opportunities/apply"
        apply_payload = {
            "opportunityId": "seed-1",
            "motivation": "I love art"
        }
        
        apply_response = session.post(apply_url, json=apply_payload)
        print(f"Apply Request: POST {apply_url}")
        print(f"Apply Payload: {json.dumps(apply_payload, indent=2)}")
        print(f"Apply Response Status: {apply_response.status_code}")
        print(f"Apply Response Body: {apply_response.text}")
        
        if apply_response.status_code == 200:
            data = apply_response.json()
            if data.get('ok') and data.get('applicationId'):
                test_data['application_id'] = data['applicationId']
                return True
        return False
    
    results.append(test_scenario(5, "Apply to opportunity seed-1", test_apply_opportunity))
    
    # Scenario 6: Duplicate apply (should fail with 409)
    def test_duplicate_apply():
        apply_url = f"{BASE_URL}/api/opportunities/apply"
        apply_payload = {
            "opportunityId": "seed-1",
            "motivation": "I love art again"
        }
        
        apply_response = session.post(apply_url, json=apply_payload)
        print(f"Duplicate Apply Request: POST {apply_url}")
        print(f"Duplicate Apply Payload: {json.dumps(apply_payload, indent=2)}")
        print(f"Duplicate Apply Response Status: {apply_response.status_code}")
        print(f"Duplicate Apply Response Body: {apply_response.text}")
        
        return apply_response.status_code == 409
    
    results.append(test_scenario(6, "Duplicate apply (expect 409)", test_duplicate_apply))
    
    # Scenario 7: Get my applications
    def test_my_applications():
        my_apps_url = f"{BASE_URL}/api/opportunities/my-applications"
        my_apps_response = session.get(my_apps_url)
        print(f"My Applications Request: GET {my_apps_url}")
        print(f"My Applications Response Status: {my_apps_response.status_code}")
        print(f"My Applications Response Body: {my_apps_response.text}")
        
        if my_apps_response.status_code == 200:
            data = my_apps_response.json()
            applications = data.get('applications', [])
            if len(applications) >= 1:
                app = applications[0]
                if app.get('status') == 'pending':
                    return True
        return False
    
    results.append(test_scenario(7, "Get my applications (>=1, status pending)", test_my_applications))
    
    # Scenario 8: Logout and login as staff
    def test_logout_login_staff():
        # Clear cookies (logout)
        session.cookies.clear()
        print("Cleared session cookies (logout)")
        
        # Get new CSRF token
        csrf_url = f"{BASE_URL}/api/auth/csrf"
        csrf_response = session.get(csrf_url)
        print(f"CSRF Request: GET {csrf_url}")
        print(f"CSRF Response Status: {csrf_response.status_code}")
        
        if csrf_response.status_code != 200:
            return False
            
        csrf_data = csrf_response.json()
        csrf_token = csrf_data.get('csrfToken')
        
        # Login as staff
        login_url = f"{BASE_URL}/api/auth/callback/credentials?json=true"
        login_payload = {
            'csrfToken': csrf_token,
            'email': test_data['staff_email'],
            'password': test_data['staff_password'],
            'callbackUrl': '/dashboard',
            'json': 'true'
        }
        
        login_response = session.post(login_url, data=login_payload)
        print(f"Staff Login Request: POST {login_url}")
        print(f"Staff Login Response Status: {login_response.status_code}")
        print(f"Staff Login Response Body: {login_response.text}")
        
        # Check for session cookie
        cookies = session.cookies
        has_session_cookie = any('next-auth.session-token' in name or '__Secure-next-auth.session-token' in name 
                                for name in cookies.keys())
        
        return login_response.status_code == 200 and has_session_cookie
    
    results.append(test_scenario(8, "Logout and login as staff", test_logout_login_staff))
    
    # Scenario 9: Check staff session
    def test_staff_session():
        session_url = f"{BASE_URL}/api/auth/session"
        session_response = session.get(session_url)
        print(f"Staff Session Request: GET {session_url}")
        print(f"Staff Session Response Status: {session_response.status_code}")
        print(f"Staff Session Response Body: {session_response.text}")
        
        if session_response.status_code == 200:
            data = session_response.json()
            if data.get('user') and data['user'].get('role') == 'staff':
                return True
        return False
    
    results.append(test_scenario(9, "Check staff session (role==staff)", test_staff_session))
    
    # Scenario 10: Create opportunity as staff
    def test_create_opportunity():
        create_url = f"{BASE_URL}/api/staff/opportunities"
        create_payload = {
            "title": "Mentor STEM",
            "org": "CUNY Tech Prep",
            "category": "STEM",
            "major": ["Computer Science"],
            "hours": 4,
            "location": "Manhattan",
            "description": "Mentor",
            "date": "2025-08-01"
        }
        
        create_response = session.post(create_url, json=create_payload)
        print(f"Create Opportunity Request: POST {create_url}")
        print(f"Create Opportunity Payload: {json.dumps(create_payload, indent=2)}")
        print(f"Create Opportunity Response Status: {create_response.status_code}")
        print(f"Create Opportunity Response Body: {create_response.text}")
        
        if create_response.status_code == 200:
            data = create_response.json()
            if data.get('ok') and data.get('id'):
                test_data['created_opportunity_id'] = data['id']
                return True
        return False
    
    results.append(test_scenario(10, "Create opportunity as staff", test_create_opportunity))
    
    # Scenario 11: Get staff applications
    def test_staff_applications():
        apps_url = f"{BASE_URL}/api/staff/applications"
        apps_response = session.get(apps_url)
        print(f"Staff Applications Request: GET {apps_url}")
        print(f"Staff Applications Response Status: {apps_response.status_code}")
        print(f"Staff Applications Response Body: {apps_response.text}")
        
        if apps_response.status_code == 200:
            data = apps_response.json()
            applications = data.get('applications', [])
            if len(applications) >= 1:
                # Find the student's application
                for app in applications:
                    if app.get('opportunityId') == 'seed-1':
                        test_data['found_application_id'] = app['id']
                        return True
        return False
    
    results.append(test_scenario(11, "Get staff applications (>=1, find student's)", test_staff_applications))
    
    # Scenario 12: Accept application
    def test_accept_application():
        if 'found_application_id' not in test_data:
            print("❌ No application ID found from previous test")
            return False
            
        app_id = test_data['found_application_id']
        accept_url = f"{BASE_URL}/api/staff/applications/{app_id}"
        accept_payload = {"status": "accepted"}
        
        accept_response = session.patch(accept_url, json=accept_payload)
        print(f"Accept Application Request: PATCH {accept_url}")
        print(f"Accept Application Payload: {json.dumps(accept_payload, indent=2)}")
        print(f"Accept Application Response Status: {accept_response.status_code}")
        print(f"Accept Application Response Body: {accept_response.text}")
        
        return accept_response.status_code == 200
    
    results.append(test_scenario(12, "Accept application", test_accept_application))
    
    # Scenario 13: Re-login as student and log hours
    def test_relogin_student_log_hours():
        # Clear cookies and re-login as student
        session.cookies.clear()
        
        # Get CSRF token
        csrf_url = f"{BASE_URL}/api/auth/csrf"
        csrf_response = session.get(csrf_url)
        if csrf_response.status_code != 200:
            return False
            
        csrf_data = csrf_response.json()
        csrf_token = csrf_data.get('csrfToken')
        
        # Login as student
        login_url = f"{BASE_URL}/api/auth/callback/credentials?json=true"
        login_payload = {
            'csrfToken': csrf_token,
            'email': test_data['student_email'],
            'password': test_data['student_password'],
            'callbackUrl': '/dashboard',
            'json': 'true'
        }
        
        login_response = session.post(login_url, data=login_payload)
        print(f"Re-login Student Response Status: {login_response.status_code}")
        
        if login_response.status_code != 200:
            return False
        
        # Log hours
        if 'found_application_id' not in test_data:
            print("❌ No application ID for logging hours")
            return False
            
        log_url = f"{BASE_URL}/api/opportunities/log-hours"
        log_payload = {
            "applicationId": test_data['found_application_id'],
            "hours": 3
        }
        
        log_response = session.post(log_url, json=log_payload)
        print(f"Log Hours Request: POST {log_url}")
        print(f"Log Hours Payload: {json.dumps(log_payload, indent=2)}")
        print(f"Log Hours Response Status: {log_response.status_code}")
        print(f"Log Hours Response Body: {log_response.text}")
        
        if log_response.status_code == 200:
            data = log_response.json()
            if data.get('ok') and data.get('hoursLogged') == 3:
                return True
        return False
    
    results.append(test_scenario(13, "Re-login student and log hours", test_relogin_student_log_hours))
    
    # Scenario 14: Create vote pledge
    def test_vote_pledge():
        pledge_url = f"{BASE_URL}/api/civic/pledge"
        pledge_payload = {
            "type": "vote",
            "note": "I will vote"
        }
        
        pledge_response = session.post(pledge_url, json=pledge_payload)
        print(f"Vote Pledge Request: POST {pledge_url}")
        print(f"Vote Pledge Payload: {json.dumps(pledge_payload, indent=2)}")
        print(f"Vote Pledge Response Status: {pledge_response.status_code}")
        print(f"Vote Pledge Response Body: {pledge_response.text}")
        
        return pledge_response.status_code == 200
    
    results.append(test_scenario(14, "Create vote pledge", test_vote_pledge))
    
    # Scenario 15: Create campaign pledge
    def test_campaign_pledge():
        pledge_url = f"{BASE_URL}/api/civic/pledge"
        pledge_payload = {
            "type": "campaign",
            "campaign": "Tuition Justice"
        }
        
        pledge_response = session.post(pledge_url, json=pledge_payload)
        print(f"Campaign Pledge Request: POST {pledge_url}")
        print(f"Campaign Pledge Payload: {json.dumps(pledge_payload, indent=2)}")
        print(f"Campaign Pledge Response Status: {pledge_response.status_code}")
        print(f"Campaign Pledge Response Body: {pledge_response.text}")
        
        return pledge_response.status_code == 200
    
    results.append(test_scenario(15, "Create campaign pledge", test_campaign_pledge))
    
    # Scenario 16: Create RSVP
    def test_create_rsvp():
        rsvp_url = f"{BASE_URL}/api/civic/rsvp"
        rsvp_payload = {
            "eventId": "evt-vote-2025",
            "eventTitle": "NYC Primary",
            "eventDate": "2025-06-24"
        }
        
        rsvp_response = session.post(rsvp_url, json=rsvp_payload)
        print(f"RSVP Request: POST {rsvp_url}")
        print(f"RSVP Payload: {json.dumps(rsvp_payload, indent=2)}")
        print(f"RSVP Response Status: {rsvp_response.status_code}")
        print(f"RSVP Response Body: {rsvp_response.text}")
        
        return rsvp_response.status_code == 200
    
    results.append(test_scenario(16, "Create RSVP", test_create_rsvp))
    
    # Scenario 17: Duplicate RSVP (should fail with 409)
    def test_duplicate_rsvp():
        rsvp_url = f"{BASE_URL}/api/civic/rsvp"
        rsvp_payload = {
            "eventId": "evt-vote-2025",
            "eventTitle": "NYC Primary",
            "eventDate": "2025-06-24"
        }
        
        rsvp_response = session.post(rsvp_url, json=rsvp_payload)
        print(f"Duplicate RSVP Request: POST {rsvp_url}")
        print(f"Duplicate RSVP Response Status: {rsvp_response.status_code}")
        print(f"Duplicate RSVP Response Body: {rsvp_response.text}")
        
        return rsvp_response.status_code == 409
    
    results.append(test_scenario(17, "Duplicate RSVP (expect 409)", test_duplicate_rsvp))
    
    # Scenario 18: Get pledges and RSVPs
    def test_get_pledges_rsvps():
        # Get pledges
        pledges_url = f"{BASE_URL}/api/civic/pledge"
        pledges_response = session.get(pledges_url)
        print(f"Get Pledges Request: GET {pledges_url}")
        print(f"Get Pledges Response Status: {pledges_response.status_code}")
        print(f"Get Pledges Response Body: {pledges_response.text}")
        
        pledges_ok = False
        if pledges_response.status_code == 200:
            data = pledges_response.json()
            pledges = data.get('pledges', [])
            if len(pledges) >= 2:
                pledges_ok = True
        
        # Get RSVPs
        rsvps_url = f"{BASE_URL}/api/civic/rsvp"
        rsvps_response = session.get(rsvps_url)
        print(f"Get RSVPs Request: GET {rsvps_url}")
        print(f"Get RSVPs Response Status: {rsvps_response.status_code}")
        print(f"Get RSVPs Response Body: {rsvps_response.text}")
        
        rsvps_ok = False
        if rsvps_response.status_code == 200:
            data = rsvps_response.json()
            rsvps = data.get('rsvps', [])
            if len(rsvps) >= 1:
                rsvps_ok = True
        
        return pledges_ok and rsvps_ok
    
    results.append(test_scenario(18, "Get pledges (2) and RSVPs (1)", test_get_pledges_rsvps))
    
    # Scenario 19: Forgot password
    def test_forgot_password():
        forgot_url = f"{BASE_URL}/api/auth/forgot-password"
        forgot_payload = {"email": test_data['student_email']}
        
        forgot_response = session.post(forgot_url, json=forgot_payload)
        print(f"Forgot Password Request: POST {forgot_url}")
        print(f"Forgot Password Payload: {json.dumps(forgot_payload, indent=2)}")
        print(f"Forgot Password Response Status: {forgot_response.status_code}")
        print(f"Forgot Password Response Body: {forgot_response.text}")
        
        if forgot_response.status_code == 200:
            data = forgot_response.json()
            if data.get('ok') and data.get('resetUrl'):
                reset_url = data['resetUrl']
                print(f"Reset URL: {reset_url}")
                
                # Parse uid and token from URL
                parsed = urlparse(reset_url)
                query_params = parse_qs(parsed.query)
                
                if 'token' in query_params and 'uid' in query_params:
                    test_data['reset_token'] = query_params['token'][0]
                    test_data['reset_uid'] = query_params['uid'][0]
                    return True
        return False
    
    results.append(test_scenario(19, "Forgot password (get reset URL)", test_forgot_password))
    
    # Scenario 20: Reset password
    def test_reset_password():
        if 'reset_token' not in test_data or 'reset_uid' not in test_data:
            print("❌ No reset token/uid from previous test")
            return False
            
        reset_url = f"{BASE_URL}/api/auth/reset-password"
        reset_payload = {
            "uid": test_data['reset_uid'],
            "token": test_data['reset_token'],
            "password": test_data['new_password']
        }
        
        reset_response = session.post(reset_url, json=reset_payload)
        print(f"Reset Password Request: POST {reset_url}")
        print(f"Reset Password Payload: {json.dumps(reset_payload, indent=2)}")
        print(f"Reset Password Response Status: {reset_response.status_code}")
        print(f"Reset Password Response Body: {reset_response.text}")
        
        return reset_response.status_code == 200
    
    results.append(test_scenario(20, "Reset password", test_reset_password))
    
    # Scenario 21: Test old password fails, new password works
    def test_password_change_verification():
        # Clear cookies
        session.cookies.clear()
        
        # Try old password (should fail)
        csrf_url = f"{BASE_URL}/api/auth/csrf"
        csrf_response = session.get(csrf_url)
        if csrf_response.status_code != 200:
            return False
            
        csrf_data = csrf_response.json()
        csrf_token = csrf_data.get('csrfToken')
        
        login_url = f"{BASE_URL}/api/auth/callback/credentials?json=true"
        old_login_payload = {
            'csrfToken': csrf_token,
            'email': test_data['student_email'],
            'password': test_data['student_password'],  # old password
            'callbackUrl': '/dashboard',
            'json': 'true'
        }
        
        old_login_response = session.post(login_url, data=old_login_payload)
        print(f"Old Password Login Response Status: {old_login_response.status_code}")
        print(f"Old Password Login Response Body: {old_login_response.text}")
        
        # Should fail
        old_password_failed = old_login_response.status_code != 200 or not any(
            'next-auth.session-token' in name for name in session.cookies.keys()
        )
        
        # Clear cookies and try new password
        session.cookies.clear()
        
        # Get new CSRF token
        csrf_response = session.get(csrf_url)
        if csrf_response.status_code != 200:
            return False
            
        csrf_data = csrf_response.json()
        csrf_token = csrf_data.get('csrfToken')
        
        new_login_payload = {
            'csrfToken': csrf_token,
            'email': test_data['student_email'],
            'password': test_data['new_password'],  # new password
            'callbackUrl': '/dashboard',
            'json': 'true'
        }
        
        new_login_response = session.post(login_url, data=new_login_payload)
        print(f"New Password Login Response Status: {new_login_response.status_code}")
        print(f"New Password Login Response Body: {new_login_response.text}")
        
        # Should succeed
        new_password_worked = new_login_response.status_code == 200 and any(
            'next-auth.session-token' in name for name in session.cookies.keys()
        )
        
        return old_password_failed and new_password_worked
    
    results.append(test_scenario(21, "Old password fails, new password works", test_password_change_verification))
    
    # Scenario 22: Test auth-required endpoints without cookie
    def test_auth_required_without_cookie():
        # Clear cookies
        session.cookies.clear()
        
        # Test endpoints that require auth
        endpoints_to_test = [
            f"{BASE_URL}/api/opportunities/my-applications",
            f"{BASE_URL}/api/civic/pledge"
        ]
        
        all_401 = True
        for endpoint in endpoints_to_test:
            response = session.get(endpoint)
            print(f"Unauthorized Request: GET {endpoint}")
            print(f"Response Status: {response.status_code}")
            print(f"Response Body: {response.text}")
            
            if response.status_code != 401:
                all_401 = False
                break
        
        return all_401
    
    results.append(test_scenario(22, "Auth-required endpoints return 401 without cookie", test_auth_required_without_cookie))
    
    # Scenario 23: Test staff-only endpoints as student
    def test_staff_only_as_student():
        # Login as student first
        csrf_url = f"{BASE_URL}/api/auth/csrf"
        csrf_response = session.get(csrf_url)
        if csrf_response.status_code != 200:
            return False
            
        csrf_data = csrf_response.json()
        csrf_token = csrf_data.get('csrfToken')
        
        login_url = f"{BASE_URL}/api/auth/callback/credentials?json=true"
        login_payload = {
            'csrfToken': csrf_token,
            'email': test_data['student_email'],
            'password': test_data['new_password'],
            'callbackUrl': '/dashboard',
            'json': 'true'
        }
        
        login_response = session.post(login_url, data=login_payload)
        if login_response.status_code != 200:
            return False
        
        # Test staff-only endpoints
        staff_endpoints = [
            (f"{BASE_URL}/api/staff/opportunities", "POST", {"title": "Test", "org": "Test", "category": "STEM"}),
        ]
        
        all_403 = True
        for endpoint, method, payload in staff_endpoints:
            if method == "POST":
                response = session.post(endpoint, json=payload)
            else:
                response = session.get(endpoint)
                
            print(f"Staff-only Request: {method} {endpoint}")
            print(f"Response Status: {response.status_code}")
            print(f"Response Body: {response.text}")
            
            if response.status_code != 403:
                all_403 = False
                break
        
        # Also test PATCH on applications
        if 'found_application_id' in test_data:
            patch_url = f"{BASE_URL}/api/staff/applications/{test_data['found_application_id']}"
            patch_response = session.patch(patch_url, json={"status": "accepted"})
            print(f"Staff-only PATCH Request: PATCH {patch_url}")
            print(f"PATCH Response Status: {patch_response.status_code}")
            
            if patch_response.status_code != 403:
                all_403 = False
        
        return all_403
    
    results.append(test_scenario(23, "Staff-only endpoints return 403 as student", test_staff_only_as_student))
    
    # Print final results
    print(f"\n{'='*80}")
    print("FINAL TEST RESULTS")
    print('='*80)
    
    passed = sum(results)
    total = len(results)
    
    for i, result in enumerate(results, 1):
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"Scenario {i:2d}: {status}")
    
    print(f"\nOverall: {passed}/{total} scenarios passed ({passed/total*100:.1f}%)")
    
    if passed == total:
        print("🎉 ALL TESTS PASSED!")
    else:
        print(f"⚠️  {total - passed} tests failed")
    
    return results

if __name__ == "__main__":
    main()